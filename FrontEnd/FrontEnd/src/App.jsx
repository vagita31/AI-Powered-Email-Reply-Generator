import React, { useState } from "react";
import axios from 'axios';
import './App.css';
import Button from '@mui/material/Button'
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const [emailContent,setEmailContent] = useState('');
  const [tone,setTone] = useState('');
  const [generatedReply,setGeneratedReply] = useState('');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  const handleSubmit = async ()=>{
      setLoading(true);
      setError('');
      try {
        const response = await axios.post("http://localhost:8080/api/email/generate", {
          emailContent,
          tone
        })
        if(response){
          setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
        }
        else{
          setGeneratedReply("response is not in format...try again ")
        }
      } catch (error) {
        console.log(error);
        setError("unable to generate reply, try again after some time" );
      } finally {
        setLoading(false);
      }


  }

  return (
    <Container maxWidth='md' sx={{py:4}}>
        <Typography variant="h3" component='h1' gutterBottom>
         Email Reply generator
          </Typography> 
            <Box sx={{ mx:3}}>
              <TextField
                fullWidth
                multiline
                rows={9}
                variant="outlined"
                label="Email Content"
                value={emailContent || ''}
                onChange={(e)=>{setEmailContent(e.target.value)}}
                sx={{ mb:2 }}
              />
              <FormControl fullWidth sx={{mb:2}}>
                <InputLabel>Tone (optional)</InputLabel>
                <Select
                  value={tone || ''}
                  label={"Tone (Optional)"}
                  onChange={(e)=> setTone(e.target.value)}
                >
                  <MenuItem value=''> nono</MenuItem>
                  <MenuItem value="professional"> Professional</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                </Select>
              </FormControl>
              <Button
                fullWidth
                onClick={handleSubmit}
                disabled={ !emailContent || loading}
                variant="contained"
              >
                {loading? <CircularProgress size={24}/> : "Generating reply"}
              </Button>
            </Box>
          
          {error && (
            <Typography color="error" sx={{ mc:2 }}>
                {error}    
            </Typography>
          )}

          {generatedReply && (
              <Box sx={{ mt:3 }}>
                <Typography variant="h6" gutterBottom >
                    Generated Reply :
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={9}
                  variant="outlined"
                  value={generatedReply || ''}
                />
                <Button
                  variant="outlined"
                  sx={{ mt:2 }}
                  onClick={()=> navigator.clipboard.writeText(generatedReply)}
                >Copy</Button>
              </Box>            
          )}
    </Container>
  )
}

export default App
