import express from 'express';
import { addExam, getUserExam } from '../controllers/mock_exam.js';

const router = express.Router();

router.post('/add-exam', addExam);
router.get('/get-exam/:userId', getUserExam);

export default router;