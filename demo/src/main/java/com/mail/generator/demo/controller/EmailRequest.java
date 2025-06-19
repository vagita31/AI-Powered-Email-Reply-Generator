package com.mail.generator.demo.controller;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class EmailRequest {
    private String emailContent;
    private String tone;
}
