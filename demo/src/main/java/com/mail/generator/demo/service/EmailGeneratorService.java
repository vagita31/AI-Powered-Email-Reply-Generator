package com.mail.generator.demo.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mail.generator.demo.controller.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.Objects;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }


    public String generateEmailReply(EmailRequest request) {
        //Build the prompt
        String promt = buildPrompt(request);

        //craft a request
        Map<String, Object> req = Map.of(
                "contents" ,new Object[] {
                        Map.of(
                                "parts",new Object[] {
                                        Map.of("text" ,promt)
                                }
                        )
                }
        );


        //do request and get response
        String res = webClient.post()
                .uri(geminiApiUrl+geminiApiKey)
                .header("Content-Type","application/json")
                .bodyValue(req)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        //extract and return response
        return extractResponse(res);
    }

    private String extractResponse(String res) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode  rootNode =  mapper.readTree(res);
            return rootNode
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            return "Enable to generate " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest request) {
        StringBuilder promt = new StringBuilder();

        promt.append("generate an professional email reply for an following content. please dont generate a subject line. ");
        if(request.getTone() != null && !request.getTone().isEmpty()) {
            promt.append("use a ").append(request.getTone()).append("tone. ");
        }
        promt.append("\n Original Email: \n").append(request.getEmailContent());
        return promt.toString();
    }
}
