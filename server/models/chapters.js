import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  chapter_name: {
    type: String,
    required: true
  },
  chapter_number: {
    type: Number,
    required: true
  }
});

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;
