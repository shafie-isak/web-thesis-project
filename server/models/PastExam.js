import mongoose from 'mongoose';

const PastExamSchema = new mongoose.Schema({
  title: String,
  year: Number,
  category: { type: String, default: 'Form 4' },
  subject: String,
  pdfUrl: String,
});

export default mongoose.model('PastExam', PastExamSchema);