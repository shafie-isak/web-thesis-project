import mongoose from "mongoose";

const XPLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  source: { type: String, enum: ["quiz", "mock", "challenge"], required: true },
  xp: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const XPLog = mongoose.model("XPLog", XPLogSchema);
export default XPLog;
