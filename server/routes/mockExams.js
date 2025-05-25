import express from 'express';
import {
    createMockExam,
    getAllMockExams,
    getMockExamById,
    saveMockProgress,
    resumeMockProgress,
    submitMockResult,
    getMockResultByExamId
} from '../controllers/mockExams.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getMockProgressBySubject } from '../controllers/mock_exam_progress.js';

const router = express.Router();

router.post('/generateMockExam', createMockExam);
router.get('/', authMiddleware, getAllMockExams);
router.get('/progress-summary', authMiddleware, getMockProgressBySubject);
router.get('/:id', authMiddleware, getMockExamById);
router.post('/submit', authMiddleware, submitMockResult);
router.post('/save-progress', authMiddleware, saveMockProgress);
router.get('/resume/:mockExamId', authMiddleware, resumeMockProgress);
router.get('/result/:mockExamId', authMiddleware, getMockResultByExamId);




export default router;
