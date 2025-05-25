import mongoose from 'mongoose';

const MockExamResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mockExamId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockExam' },
    score: Number,
    total: Number,
    timeTaken: Number,
    answers: [String],
    submittedAt: { type: Date, default: Date.now }
  });
  
  export default mongoose.model('MockExamResult', MockExamResultSchema);
  