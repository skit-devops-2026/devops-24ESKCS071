import express from 'express';
import multer from 'multer';
import { 
  executeAgentCommand, 
  generateInterviewQuestions, 
  evaluateInterviewAnswer 
} from '../controllers/agentController.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/command', executeAgentCommand);
router.post('/interview', upload.single('resumePdf'), generateInterviewQuestions);
router.post('/evaluate-answer', evaluateInterviewAnswer);

export default router;
