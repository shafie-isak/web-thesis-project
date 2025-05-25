import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: String,
    difficulty_level: String,
    chapter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }
});

const Question = mongoose.model('Question', QuestionSchema, 'questions');
export default Question;