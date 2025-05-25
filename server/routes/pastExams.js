import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadPastExam, getAllPastExams } from '../controllers/pastExams.js';

const router = express.Router();

// Multer setup to preserve original filename
const storage = multer.diskStorage({
  destination: 'uploads/past_exams',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .pdf
    const name = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('pdf'), uploadPastExam);
router.get('/', getAllPastExams);

export default router;
