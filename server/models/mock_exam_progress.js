import mongoose from 'mongoose';

const MockExamProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mockExamId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockExam', required: true },
  answers: [Number],
  remainingSeconds: Number,
  updatedAt: { type: Date, default: Date.now }
});

MockExamProgressSchema.index({ userId: 1, mockExamId: 1 }, { unique: true });

export default mongoose.model('MockExamProgress', MockExamProgressSchema);