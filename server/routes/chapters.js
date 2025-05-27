import express from "express";
import {
  getChapters,
  getChaptersBySubject,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../controllers/chapters.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getChapters);
router.get("/by-subject/:subjectId", authMiddleware, getChaptersBySubject);
router.post("/", authMiddleware, createChapter);
router.put("/:id", authMiddleware, updateChapter);
router.delete("/:id", authMiddleware, deleteChapter);

export default router;
