import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const OLLAMA_API = 'http://localhost:11434/api/generate';

app.post('/api/analyze', async (req, res) => {
  const { text, action } = req.body;
  
  let prompt = '';
  switch (action) {
    case 'summarize':
      prompt = `Please provide a concise summary of the following text:\n${text}`;
      break;
    case 'polish':
      prompt = `Please improve and polish the following text to make it more professional and engaging:\n${text}`;
      break;
    case 'elaborate':
      prompt = `Please elaborate on the following text with more details and examples:\n${text}`;
      break;
    case 'search':
      prompt = `Please provide relevant information and context about:\n${text}`;
      break;
    case 'concise':
      prompt = `Please make the following text more concise while maintaining its key points:\n${text}`;
      break;
    default:
      return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    const response = await axios.post(OLLAMA_API, {
      model: 'llama2:3b',
      prompt,
      stream: false
    });

    res.json({ result: response.data.response });
  } catch (error) {
    console.error('Error calling Ollama:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});