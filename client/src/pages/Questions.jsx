import React, { useEffect, useState } from "react";
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  fetchSubjects,
  fetchChapters,
} from "../utils/api";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaSortNumericDown,
  FaSortAlphaDown,
  FaFileExport,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';

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
  const [sortType, setSortType] = useState("difficulty");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
    const [filterSubject, setFilterSubject] = useState("");
  const [filterChapter, setFilterChapter] = useState("");
  



  const loadQuestions = async () => {
    setLoading(true)
    try {
      const data = await fetchQuestions();
      setQuestions(data);
    } catch {
      toast.error("Failed to load questions");
    }
    finally {
      setLoading(false)
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
    try {
      const data = await fetchChapters();
      setChapters(data);
    } catch {
      toast.error("Failed to load chapters");
    }
  };

  useEffect(() => {
    loadQuestions();
    loadSubjects();
    loadChapters();
  }, []);

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
      setFormData({ question: "", options: [""], answer: "", difficulty_level: "", chapter_id: "" });
      setCurrent(null);
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    const { question, options, answer, difficulty_level, chapter_id } = formData;
    if (!question || !options.length || !answer || !difficulty_level || !chapter_id) {
      toast.warning("All fields are required");
      return;
    }

    setSaving(true); // start loading
    try {
      if (current) {
        await updateQuestion(current._id, formData);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Question updated successfully!",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        await createQuestion(formData);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Question created successfully!",
          showConfirmButton: false,
          timer: 1500
        });
      }
      loadQuestions();
      setModalOpen(false);
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false); // stop loading
    }
  };



  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This question will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      // Show loading spinner
      Swal.fire({
        title: 'Deleting...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        await deleteQuestion(id);
        Swal.close(); // Close loading
        await loadQuestions();

        // ✅ Show success popup
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The question has been successfully deleted.',
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        });
      } catch {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to delete the question.',
        });
      }
    }
  };



const exportCSV = () => {
  const headers = ["Question", "Answer", "Difficulty", "Chapter", "Subject"];
  const rows = sortedFiltered.map((q) => [
    q.question,
    q.answer,
    q.difficulty_level,
    q.chapter_id?.chapter_name || "",
    q.chapter_id?.subject_id?.subject_name || ""
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

  const now = new Date();
  const filename = `questions_filtered_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}.csv`;

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  const sortedFiltered = questions
    .filter((q) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterSubject ? q.chapter_id.subject_id?._id === filterSubject : true) &&
      (filterChapter ? q.chapter_id?._id === filterChapter : true)
    )
    .sort((a, b) => {
      if (sortType === "difficulty") return a.difficulty_level.localeCompare(b.difficulty_level);
      if (sortType === "chapter") return a.chapter_id.chapter_name - b.chapter_id.chapter_name;
      return 0;
    });

  return (
    <div className="px-6 text-white">
      <div className="flex justify-between items-center mb-4 gap-3">
        <div className="flex gap-3 flex-1">
          <div className="flex items-center bg-white/10 text-white border border-white/30 rounded-full px-4 py-2 w-full max-w-sm">
            <FaSearch className="text-white/70 mr-2" />
            <input
              type="text"
              placeholder="Search by question or chapter..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent focus:outline-none text-sm placeholder-white/50 w-full"
            />
          </div>
          <select onChange={(e) => setSortType(e.target.value)} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white focus:outline-none focus:border-white/50">
            <option  className="text-black/75" value="difficulty">Sort by Difficulty</option>
            <option  className="text-black/75" value="chapter">Sort by Chapter Name</option>
          </select>
          <select onChange={(e) => setFilterSubject(e.target.value)} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white focus:outline-none focus:border-white/50">
            <option  className="text-black/50" value="">All Subjects</option>
            {subjects.map(sub => <option  className="text-black/75" key={sub._id} value={sub._id}>{sub.subject_name}</option>)}
          </select>
          <select onChange={(e) => setFilterChapter(e.target.value)} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white focus:outline-none max-w[200px] focus:border-white/50">
            <option className="text-black/50" value="">All Chapters</option>
            {chapters.map(ch => <option  className="text-black/75" key={ch._id} value={ch._id}>{ch.chapter_name}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={() => openModal()} className="px-4 py-2 border border-white/30 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-2">
            <FaPlus /> Add Question
          </button>
          <button onClick={() => exportCSV()} className="px-4 py-2 border border-white/30 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-2">
            <FaFileExport /> Export CSV
          </button>
        </div>
      </div>

      <h2>Questions Bank</h2>

      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white/50"></div>
        </div>
      ) : (
        <div className="rounded-xl h-[70vh] overflow-y-auto border border-white/20">
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
              {sortedFiltered.map((q) => (
                <tr key={q._id} className="hover:bg-white/5 border-t border-white/10">
                  <td className="p-3">{q.question}</td>
                  <td className="p-3">{q.answer}</td>
                  <td className="p-3">{q.difficulty_level}</td>
                  <td className="p-3">{q.chapter_id.chapter_name}</td>
                  <td className="p-3">{q.chapter_id.subject_id?.subject_name || "N/A"}</td>
                  <td className="p-3 text-right flex gap-2 items-center">
                    <button onClick={() => openModal(q)} className="p-2 bg-blue-600 hover:bg-blue-700 rounded">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(q._id)} className="p-2 bg-red-600 hover:bg-red-700 rounded">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white text-black p-6 rounded-lg w-full max-w-md"
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{current ? "Edit Question" : "Add Question"}</h2>
              <button onClick={() => setModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <textarea
                  rows={3}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Options</label>
                {formData.options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...formData.options];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, options: updated });
                      }}
                      className="w-full border p-2 rounded"
                      placeholder={`Option ${idx + 1}`}
                    />
                    {formData.options.length > 1 && (
                      <button
                        onClick={() => {
                          const filtered = formData.options.filter((_, i) => i !== idx);
                          setFormData({ ...formData, options: filtered });
                        }}
                        className="px-2 text-red-600 font-bold"
                      >×</button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setFormData({ ...formData, options: [...formData.options, ""] })}
                  className="mt-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm rounded"
                >
                  + Add Option
                </button>
              </div>

              <div>
                <label className="text-sm font-medium">Answer</label>
                <input
                  type="text"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                  className="w-full border p-2 rounded"
                >
                  <option value="">-- Select --</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Chapter</label>
                <select
                  value={formData.chapter_id}
                  onChange={(e) => setFormData({ ...formData, chapter_id: e.target.value })}
                  className="w-full border p-2 rounded"
                >
                  <option value="">-- Select --</option>
                  {chapters.map((ch) => (
                    <option key={ch._id} value={ch._id}>
                      {ch.chapter_name} ({ch.chapter_number})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded text-white transition ${saving
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
                  }`}
              >
                {saving ? (current ? "Updating..." : "Creating...") : (current ? "Update." : "Create")}
              </button>

            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Questions;
