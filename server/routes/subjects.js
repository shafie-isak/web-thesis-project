import express from 'express';

import {getSubjects, createSubject, deleteSubject, updateSubject} from '../controllers/subjects.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getSubjects);
router.post('/', authMiddleware, createSubject);
router.put('/:id', authMiddleware, updateSubject);
router.delete('/:id', authMiddleware, deleteSubject);


export default router;