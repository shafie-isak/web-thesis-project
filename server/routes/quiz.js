import express from 'express';
import {
  addQuiz,
  getChapters,
  getQuestions,
  getUserQuiz,
  saveQuizPreview,
  getSavedQuizzes,
} from '../controllers/quiz.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add-quiz', authMiddleware, addQuiz);
router.get('/get-quiz/:userId', authMiddleware, getUserQuiz);
router.get('/get-questions', getQuestions);
router.get('/get-chapters/:subject_id', getChapters);
router.post('/save-quiz-preview', authMiddleware, saveQuizPreview);
router.get('/get-saved-quizzes/', authMiddleware, getSavedQuizzes);


export default router;
