import express from 'express';
import { createMockExam, getMockExams, updateMockExam, deleteMockExam } from '../controllers/mockExams.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getMockExams);
router.post('/', authMiddleware, createMockExam);
router.put('/:id', authMiddleware, updateMockExam);
router.delete('/:id', authMiddleware, deleteMockExam);

export default router;
