import express from 'express';
import {
  addQuiz,
  getChapters,
  getQuestions,
  getSubjects,
  getUserQuiz,
  saveQuizPreview,
  getSavedQuizzes,
} from '../controllers/quiz.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add-quiz', authMiddleware, addQuiz); // ✅ protected
router.get('/get-quiz/:userId', authMiddleware, getUserQuiz); // ✅ protected
router.get('/get-questions', getQuestions); // ❌ public
router.get('/get-chapters/:subject_id', getChapters); // ❌ public
router.get('/get-subjects', getSubjects); // ❌ public
router.post('/save-quiz-preview', authMiddleware, saveQuizPreview); // ✅ protected
router.get('/get-saved-quizzes/', authMiddleware, getSavedQuizzes); // ✅ protected


export default router;
