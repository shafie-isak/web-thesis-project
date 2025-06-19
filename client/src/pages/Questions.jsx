import React, { useEffect, useState } from "react";
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  fetchSubjects,
  fetchChaptersBySubject,
} from "../utils/api";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFileExport,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import QuestionsSkeleton from "../components/skeletons/QeustionsSkeleton";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [formData, setFormData] = useState({
    question: "",
    options: [""],
    answer: "",
    difficulty_level: "",
    chapter_id: "",
  });
  const [current, setCurrent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ✅ persist subject + chapter using localStorage
  const savedSubject = localStorage.getItem("filterSubject") || "";
  const savedChapter = localStorage.getItem("filterChapter") || "";

  const [filterSubject, setFilterSubject] = useState(savedSubject);
  const [filterChapter, setFilterChapter] = useState(savedChapter);

  const handleSubjectChange = (value) => {
    setFilterSubject(value);
    localStorage.setItem("filterSubject", value);

    setFilterChapter("");
    localStorage.setItem("filterChapter", "");
  };


  const handleChapterChange = (value) => {
    setFilterChapter(value);
    localStorage.setItem("filterChapter", value);
  };

  const loadQuestions = async (pageToLoad = 1) => {
    setLoading(true);
    try {
      const data = await fetchQuestions({
        subjectId: filterSubject,
        chapterId: filterChapter,
        page: pageToLoad,
        limit: 50,
      });

      if (pageToLoad === 1) {
        setQuestions(data.questions);
      } else {
        setQuestions((prev) => [...prev, ...data.questions]);
      }

      setHasMore(pageToLoad < data.pages);
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await fetchSubjects();
      setSubjects(data);
    } catch {
      toast.error("Failed to load subjects");
    }
  };

  const loadChapters = async () => {
    if (!filterSubject) return;
    try {
      const data = await fetchChaptersBySubject(filterSubject);
      setChapters(data);
    } catch {
      toast.error("Failed to load chapters");
    }
  };

  useEffect(() => {
    loadSubjects();
    loadChapters();
  }, []);

  useEffect(() => {
    if (filterSubject) {
      loadChapters();
    } else {
      setChapters([]);
    }

    setPage(1);
    setQuestions([]);
    setHasMore(true);
    loadQuestions(1);
  }, [filterSubject, filterChapter]);

  useEffect(() => {
    if (page > 1) {
      loadQuestions(page);
    }
  }, [page]);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const openModal = (q = null) => {
    if (q) {
      setFormData({
        question: q.question,
        options: q.options || [""],
        answer: q.answer,
        difficulty_level: q.difficulty_level,
        chapter_id: q.chapter_id._id || q.chapter_id,
      });
      setCurrent(q);
    } else {
      setFormData({
        question: "",
        options: [""],
        answer: "",
        difficulty_level: "",
        chapter_id: "",
      });
      setCurrent(null);
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    const { question, options, answer, difficulty_level, chapter_id } =
      formData;
    if (
      !question ||
      !options.length ||
      !answer ||
      !difficulty_level ||
      !chapter_id
    ) {
      toast.warning("All fields are required");
      return;
    }

    setSaving(true);
    try {
      if (current) {
        await updateQuestion(current._id, formData);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Question updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await createQuestion(formData);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Question created successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setPage(1);
      setHasMore(true);
      loadQuestions(1);
      setModalOpen(false);
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This question will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await deleteQuestion(id);
        Swal.close();
        setPage(1);
        setHasMore(true);
        loadQuestions(1);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The question has been successfully deleted.",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      } catch {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Failed to delete the question.",
        });
      }
    }
  };

  const exportCSV = () => {
    const headers = ["Question", "Answer", "Difficulty", "Chapter", "Subject"];
    const rows = questions.map((q) => [
      q.question,
      q.answer,
      q.difficulty_level,
      q.chapter_id?.chapter_name || "",
      q.chapter_id?.subject_id?.subject_name || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

    const now = new Date();
    const filename = `questions_filtered_${now.getFullYear()}_${now.getMonth() + 1
      }_${now.getDate()}.csv`;

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && questions.length === 0) return <QuestionsSkeleton />;

  return (
    <div className="px-6 text-white">
      <h2 className="text-2xl font-bold text-white pb-3">Questions Bank</h2>

      <div className="flex justify-between items-center mb-4 gap-3">
        <div className="flex gap-3 flex-1">
          <div className="flex items-center bg-white/10 text-white border border-white/30 rounded-full px-4 py-2">
            <FaSearch className="text-white/70 mr-2" />
            <input
              type="text"
              placeholder="Type here to search"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent focus:outline-none text-sm placeholder-white/50 w-full"
            />
          </div>
          <select
            value={filterSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white focus:outline-none focus:border-white/50"
          >
            <option className="text-black/50" value="">
              All Subjects
            </option>
            {subjects.map((sub) => (
              <option
                className="text-black/75"
                key={sub._id}
                value={sub._id}
              >
                {sub.subject_name}
              </option>
            ))}
          </select>
          <select
            value={filterChapter}
            onChange={(e) => handleChapterChange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white focus:outline-none focus:border-white/50"
          >
            <option className="text-black/50" value="">
              All Chapters
            </option>
            {chapters.map((ch) => (
              <option className="text-black/75" key={ch._id} value={ch._id}>
                {ch.chapter_name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openModal()}
            className="px-4 py-2 border border-white/30 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-2"
          >
            <FaPlus /> Add Question
          </button>
          <button
            onClick={() => exportCSV()}
            className="px-4 py-2 border border-white/30 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-2"
          >
            <FaFileExport /> Export CSV
          </button>
        </div>
      </div>

      <div
        className="rounded-xl h-[70vh] overflow-y-auto border border-white/20"
        onScroll={handleScroll}
      >
        <table className="w-full text-sm">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="p-3 text-left">Question</th>
              <th className="p-3 text-left">Answer</th>
              <th className="p-3 text-left">Level</th>
              <th className="p-3 text-left">Chapter</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions
              .filter((q) =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((q) => (
                <tr
                  key={q._id}
                  className="hover:bg-white/5 border-t border-white/10"
                >
                  <td className="p-3">{q.question}</td>
                  <td className="p-3">{q.answer}</td>
                  <td className="p-3">{q.difficulty_level}</td>
                  <td className="p-3">{q.chapter_id.chapter_name}</td>
                  <td className="p-3">
                    {q.chapter_id.subject_id?.subject_name || "N/A"}
                  </td>
                  <td className="p-3 text-right flex gap-2 items-center">
                    <button
                      onClick={() => openModal(q)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Questions;
