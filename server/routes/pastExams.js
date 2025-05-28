import express from 'express';
import multer from 'multer';
import {
  uploadPastExam,
  getAllPastExams,
  getPastExamById,
  updatePastExam,
  deletePastExam,
} from '../controllers/pastExams.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/past_exams',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post('/', upload.single('pdf'), uploadPastExam);
router.get('/', getAllPastExams);
router.get('/:id', getPastExamById);
router.put('/:id', upload.single('pdf'), updatePastExam);
router.delete('/:id', deletePastExam);

export default router;
