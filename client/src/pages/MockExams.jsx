import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import MockExamsSkeleton from "../components/skeletons/MockExamsSkeleton";

const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

const MockExams = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subject_id: "",
    numQuestions: "",
    timeLimit: "",
  });
  const [editData, setEditData] = useState(null);
  const [filterSubject, setFilterSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // ID of exam being deleted




  const loadExams = async () => {
    try {
      const res = await axios.get("http://54.173.216.17:5000/api/mockexams", { headers });
      setExams(res.data);
    } catch (err) {
      console.error("Failed to load mock exams", err);
    }
  };

  const loadSubjects = async () => {
    try {
      const res = await axios.get("http://54.173.216.17:5000/api/subjects", { headers });
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error("Failed to load subjects", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadExams();
        await loadSubjects();
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = exams
    .filter(e =>
      (!filterSubject || e.subject_id._id === filterSubject) &&
      e.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreate = async () => {
    const { subject_id, numQuestions, timeLimit } = formData;
    if (!subject_id || !numQuestions || !timeLimit)
      return Swal.fire("All fields required", "", "warning");

    setCreating(true);

    try {
      // Step 1: Get subject name
      const subject = subjects.find(s => s._id === subject_id);
      if (!subject) {
        Swal.fire("Invalid subject", "", "error");
        setCreating(false);
        return;
      }

      const baseTitle = `Mock Exam - ${subject.subject_name}`;

      // Step 2: Get all existing exams
      const res = await axios.get("http://54.173.216.17:5000/api/mockexams", { headers });
      const allExams = res.data;

      // Step 3: Filter exams that match this baseTitle or baseTitle (n)
      const similarExams = allExams.filter(e =>
        e.title.startsWith(baseTitle)
      );

      let finalTitle = baseTitle;
      if (similarExams.length > 0) {
        const usedNumbers = similarExams.map(e => {
          const match = e.title.match(/\((\d+)\)$/);
          return match ? parseInt(match[1]) : 0;
        });

        const maxNumber = Math.max(...usedNumbers, 0);
        finalTitle = `${baseTitle} (${maxNumber + 1})`;
      }

      // Step 4: Send POST request with unique title
      await axios.post("http://54.173.216.17:5000/api/mockexams", {
        subject_id,
        numberOfQuestions: numQuestions,
        timeLimit,
        title: finalTitle,
      }, { headers });

      Swal.fire("Created!", `Mock exam '${finalTitle}' created successfully`, "success");
      loadExams();
    } catch (err) {
      Swal.fire("Failed", err.response?.data?.message || "Error creating", "error");
    } finally {
      setCreating(false);
    }
  };




  const handleEdit = async () => {
    if (!editData?.title || !editData?.timeLimit)
      return Swal.fire("All fields required", "", "warning");

    setUpdating(true);
    try {
      await axios.put(`http://54.173.216.17:5000/api/mockexams/${editData._id}`, editData, { headers });
      Swal.fire("Updated", "Mock exam updated", "success");
      loadExams();
      setEditData(null);
    } catch {
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setUpdating(false);
    }
  };


  const handleDelete = async (id) => {
    const confirm = await Swal.fire({ title: "Delete exam?", showCancelButton: true });
    if (!confirm.isConfirmed) return;

    setDeletingId(id);
    try {
      await axios.delete(`http://54.173.216.17:5000/api/mockexams/${id}`, { headers });
      Swal.fire("Deleted", "Mock exam removed", "success");
      loadExams();
    } catch {
      Swal.fire("Error", "Failed to delete", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if(loading) return <MockExamsSkeleton/>

  return (
    <div className="p-6 text-white">
      <h2 >Mock Exams</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center px-4 py-2 bg-white/10 rounded-full border border-white/30">
            <FaSearch className="text-white/50 mr-2" />
            <input
              type="text"
              placeholder="Search by title"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent focus:outline-none text-white"
            />
          </div>

          <select onChange={(e) => setFilterSubject(e.target.value)} className="px-4 py-2 bg-white/10 rounded-full">
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.subject_name}</option>)}
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/50 hover:bg-white/30 rounded-full"
        >
          <FaPlus /> Create
        </button>


      </div>


        <div>
          <div className="rounded-xl ma-h-[67vh] border border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-700">
                <tr>
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Subject</th>
                  <th className="text-left p-3">Time Limit (s)</th>
                  <th className="text-left p-3">Questions</th>
                  <th className="text-left p-3">Created</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((mock) => (
                  <tr key={mock._id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-3">{mock.title}</td>
                    <td className="p-3">{mock.subject_id?.subject_name}</td>
                    <td className="p-3">{mock.timeLimit}s</td>
                    <td className="p-3">{mock.question_ids.length}</td>
                    <td className="p-3">{new Date(mock.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 flex justify-center items-center gap-2">
                      <button
                        onClick={() => setEditData(mock)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
                      >
                        <FaEdit />
                      </button> {deletingId === mock._id ? <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                      </div> : <button
                        onClick={() => handleDelete(mock._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
                        disabled={deletingId === mock._id}
                      >
                        <FaTrash />
                      </button>}


                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginated.length === 0 && (
                <div className="bg-white/10 rounded-xl p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-white/50 mb-2">No Mock Exams found</h3>
                  <p className="text-white/50 ">Try adjusting your search or create a new mock exam</p>
                </div>
              )}
          </div>


          {filtered.length > itemsPerPage && (
            <div className="flex items-center justify-center mt-4 gap-4 text-white">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-1 bg-purple-700 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {Math.ceil(filtered.length / itemsPerPage)}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(filtered.length / itemsPerPage))
                  )
                }
                disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)}
                className="px-4 py-1 bg-purple-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        
      {/* Create Form */}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">Create Mock Exam</h2>
            <select
              value={formData.subject_id}
              onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
              className="w-full p-2 border mb-3 rounded"
            >
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.subject_name}</option>)}
            </select>
            <input
              type="number"
              placeholder="Number of Questions"
              value={formData.numQuestions}
              onChange={(e) => setFormData({ ...formData, numQuestions: e.target.value })}
              className="w-full p-2 border mb-3 rounded"
            />
            <input
              type="number"
              placeholder="Time Limit (seconds)"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
              className="w-full p-2 border mb-3 rounded"
            />
            <div className="text-right">
              <button onClick={() => setShowCreateModal(false)} className="px-3 py-1 bg-gray-300 rounded mr-2">Cancel</button>
              <button
                onClick={async () => {
                  await handleCreate();
                  setShowCreateModal(false);
                }}
                className="px-3 py-1 bg-purple-600 text-white rounded"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create"}
              </button>

            </div>
          </motion.div>
        </div>
      )}




      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">Edit Mock Exam</h2>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full p-2 border mb-3 rounded"
            />
            <input
              type="number"
              value={editData.timeLimit}
              onChange={(e) => setEditData({ ...editData, timeLimit: e.target.value })}
              className="w-full p-2 border mb-3 rounded"
            />
            <div className="text-right">
              <button onClick={() => setEditData(null)} className="px-3 py-1 bg-gray-300 rounded mr-2">Cancel</button>
              <button
                onClick={handleEdit}
                className="px-3 py-1 bg-purple-600 text-white rounded"
                disabled={updating}
              >
                {updating ? "Updating..." : "Save"}
              </button>

            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MockExams;
