import mongoose from "mongoose";

const chapterSchema= new mongoose.Schema({
    chapter_name: String,
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
});
const Chapter = mongoose.model('Chapter', chapterSchema, 'chapters');
export default Chapter;