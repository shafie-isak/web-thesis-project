import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/database.js';
import userRoutes from './routes/user.js';
import subjectsRoutes from './routes/subjects.js';
import chapterRoutes from "./routes/chapters.js";
import questionRoutes from "./routes/questions.js";
import quizRoutes from './routes/quiz.js';
import mockExamRoutes from './routes/mockExams.js';
import challengeRoutes from './routes/challenges.js';
import { scheduleDailyChallenge } from './cron/generate_daily.js';
import pastExamRoutes from './routes/pastExams.js';
import adminRoutes from './routes/admin.js';

// import './cron/generateMockExams.js';
import cors from 'cors';
import fs from 'fs';
import path from 'path';


dotenv.config();
const app = express();

// ✅ Increase JSON body limit to handle base64 images (still good to keep)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use(cors());
connectDB();

//Generate daily challenge quiz
scheduleDailyChallenge(); 



// ✅ Register routes

app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/questions", questionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/mockexams', mockExamRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/pastexams', pastExamRoutes);
app.use('/api/admin', adminRoutes);



// ✅ Serve PDF as inline BEFORE the static route
app.get('/uploads/past_exams/:filename', (req, res) => {
  const filePath = path.resolve(`uploads/past_exams/${req.params.filename}`);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); // 👈 open in-browser
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

app.use('/uploads', express.static('uploads'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
