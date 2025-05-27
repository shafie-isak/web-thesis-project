import express from 'express';

import {getQuestions, createQuestion, deleteQuestion, updateQuestion} from '../controllers/questions.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getQuestions);
router.post('/', authMiddleware, createQuestion);
router.put('/:id', authMiddleware, updateQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);


export default router;