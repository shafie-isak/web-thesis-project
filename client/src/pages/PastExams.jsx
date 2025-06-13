import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilePdf } from "react-icons/fa";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionsSkeleton from "../components/skeletons/QeustionsSkeleton";
import PastExamsSkeleton from "../components/skeletons/PastExamsSkeleton";

Modal.setAppElement("#root");

const API_BASE_URL = "http://54.173.216.17:5000/api/pastexams";
const ITEMS_PER_PAGE = 9;

const PastExams = () => {

  const [exams, setExams] = useState([]);
  const [filters, setFilters] = useState({
    year: "",
    subject: "",
    category: "",
    searchTerm: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    subject: "",
    category: "",
    pdf: null
  });
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_BASE_URL);
      setExams(res.data);
    } catch (error) {
      toast.error("Failed to fetch exams");
      console.error("Error fetching exams:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredExams = exams.filter((exam) => {
    return (
      (!filters.year || exam.year === parseInt(filters.year)) &&
      (!filters.subject || exam.subject === filters.subject) &&
      (!filters.category || exam.category === filters.category) &&
      exam.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
  });

  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
  const uniqueValues = (key) => [...new Set(exams.map(e => e[key]))].filter(Boolean);

  const openAddModal = () => {
    setFormData({ title: "", year: "", subject: "", category: "", pdf: null });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (exam) => {
    setFormData({
      title: exam.title,
      year: exam.year,
      subject: exam.subject,
      category: exam.category,
      pdf: null
    });
    setEditingId(exam._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  });

  if (result.isConfirmed) {
    try {
      setDeletingId(id);
      await axios.delete(`${API_BASE_URL}/${id}`);
      await fetchExams();
      Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The Past exam paper has been successfully deleted.',
                timer: 1500,
                showConfirmButton: false,
                timerProgressBar: true
              });
    } catch (error) {
      toast.error("Failed to delete exam");
    } finally {
      setDeletingId(null);
    }
  }
};


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("year", formData.year);
    data.append("subject", formData.subject);
    data.append("category", formData.category);
    if (formData.pdf) data.append("pdf", formData.pdf);

    try {
      setFormLoading(true);
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, data);
        toast.success("Exam updated successfully");
      } else {
        await axios.post(API_BASE_URL, data);
        toast.success("Exam added successfully");
      }
      setModalOpen(false);
      fetchExams();
    } catch (error) {
      toast.error(`Failed to ${editingId ? "update" : "add"} exam`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if(isLoading) return <PastExamsSkeleton/>;

  return (
    <div className="px-6  text-white min-h-[87vh]">
      <div className="flex flex-col md:flex-row justify-between mb-2 gap-4">
        <h2 className="text-2xl font-bold">Past Federal Exams</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 border border-white/30 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Add Exam
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div className=" flex items-center bg-white/10 border border-white/30 rounded-full px-4 py-2">
          <FaSearch className="text-white/70 mr-2" />
          <input
            type="text"
            name="searchTerm"
            placeholder="Search exams..."
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className="bg-transparent focus:outline-none placeholder-white/50 w-full"
          />
        </div>

        <select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          className="px-4 py-2 bg-white/10 rounded-full focus:outline-none"
        >
          <option className="text-black/50" value="">All Years</option>
          {uniqueValues("year").sort().map(y => (
            <option className="text-black/75" key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          name="subject"
          value={filters.subject}
          onChange={handleFilterChange}
          className="px-4 py-2 bg-white/10 rounded-full focus:outline-none"
        >
          <option className="text-black/50" value="">All Subjects</option>
          {uniqueValues("subject").sort().map(s => (
            <option className="text-black/75" key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="px-4 py-2 bg-white/10 rounded-full focus:outline-none"
        >
          <option className="text-black/50" value="">All Categories</option>
          {uniqueValues("category").sort().map(c => (
            <option className="text-black/75" key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <table className="w-full">
              <thead className="bg-purple-700">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Year</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">PDF</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExams.length > 0 ? (
                  paginatedExams.map(exam => (
                    <tr key={exam._id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-3">{exam.title}</td>
                      <td className="p-3">{exam.year}</td>
                      <td className="p-3">{exam.subject}</td>
                      <td className="p-3">{exam.category}</td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedPdf(`${API_BASE_URL.replace('/api', '')}${exam.pdfUrl}`)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <FaFilePdf /> View
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditModal(exam)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            aria-label="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(exam._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            aria-label="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-white/70">
                      No exams found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
      </div>

      {/* Pagination */}
      {filteredExams.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white/10 rounded-full disabled:opacity-50 hover:bg-white/20 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white/10 rounded-full disabled:opacity-50 hover:bg-white/20 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white/20 text-white p-6 rounded-xl max-w-md mx-auto mt-20 border border-white/10"
        overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      >
        <h3 className="text-xl font-bold mb-4">
          {editingId ? "Edit Exam" : "Add New Exam"}
        </h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Exam title"
              className="w-full px-4 py-2 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Year</label>
            <input
              name="year"
              type="number"
              value={formData.year}
              onChange={handleFormChange}
              placeholder="2023"
              className="w-full px-4 py-2 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Subject</label>
            <input
              name="subject"
              value={formData.subject}
              onChange={handleFormChange}
              placeholder="Mathematics"
              className="w-full px-4 py-2 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              placeholder="Final Exam"
              className="w-full px-4 py-2 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">PDF File</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, pdf: e.target.files[0] })}
              className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-colors"
              accept=".pdf"
            />
            {editingId && (
              <p className="text-xs text-white/50 mt-1">
                Leave empty to keep current file
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-white/20 hover:bg-gray-600 rounded transition-colors"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors" type="submit" disabled={formLoading}>
              {formLoading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update" : "Create")}
            </button>

          </div>
        </form>
      </Modal>

      {/* PDF Viewer Modal */}
      <Modal
        isOpen={!!selectedPdf}
        onRequestClose={() => setSelectedPdf(null)}
        className="bg-black p-0 max-w-6xl mx-auto my-12 rounded-lg overflow-hidden"
        overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
      >
        <div className="flex justify-between items-center bg-gray-900 p-3">
          <h4 className="font-medium">PDF Viewer</h4>
          <button
            onClick={() => setSelectedPdf(null)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
          >
            Close
          </button>
        </div>
        <iframe
          src={selectedPdf}
          width="100%"
          height="600px"
          title="PDF Viewer"
          className="border-none"
        />
      </Modal>
    </div>
  );
};

export default PastExams;
