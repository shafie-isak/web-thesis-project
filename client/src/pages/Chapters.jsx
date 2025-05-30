import React, { useEffect, useState } from "react";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSortNumericDown,
    FaSortAlphaDown,
    FaTimes,
    FaSearch,
    FaFileExport
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    fetchChapters,
    fetchSubjects,
    createChapter,
    updateChapter,
    deleteChapter,
} from "../utils/api";
import Swal from 'sweetalert2';
import ChaptersSkeleton from "../components/skeletons/ChaaptersSkeleton";

const Chapters = () => {
    const [chapters, setChapters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortType, setSortType] = useState("number");
    const [sortOrder, setSortOrder] = useState("asc");
    const [saveLoading, setSaveLoading] = useState(false);



    const [formData, setFormData] = useState({
        chapter_name: "",
        chapter_number: "",
        subject_id: "",
    });

    const loadChapters = async () => {
        try {
            const data = await fetchChapters();
            setChapters(data);
        } catch {
            toast.error("Failed to load chapters");
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

    useEffect(() => {
        loadChapters();
        loadSubjects();
    }, []);

    const openModal = (chapter = null) => {
        if (chapter) {
            setFormData({
                chapter_name: chapter.chapter_name,
                chapter_number: chapter.chapter_number,
                subject_id: chapter.subject_id._id || chapter.subject_id,
            });
            setCurrent(chapter);
        } else {
            setFormData({ chapter_name: "", chapter_number: "", subject_id: "" });
            setCurrent(null);
        }
        setModalOpen(true);
    };

    const handleSave = async () => {
        const { chapter_name, chapter_number, subject_id } = formData;
        if (!chapter_name || !chapter_number || !subject_id) {
            toast.warning("All fields are required");
            return;
        }

        setSaveLoading(true); // start loading

        try {
            if (current) {
                await updateChapter(current._id, formData);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Chapter updated successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                await createChapter(formData);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Chapter created successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            loadChapters();
            setModalOpen(false);
        } catch {
            toast.error("Error saving chapter");
        } finally {
            setSaveLoading(false); // stop loading
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Delete this chapter?")) return;
        try {
            await deleteChapter(id);
            toast.success("Chapter deleted");
            loadChapters();
        } catch (err) {
            if (err.response?.status === 400) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Delete failed");
            }
        }
    };

    const sortedFiltered = chapters
        .filter((c) =>
            c.chapter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.subject_id.subject_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const modifier = sortOrder === "asc" ? 1 : -1;
            if (sortType === "number") return (a.chapter_number - b.chapter_number) * modifier;
            if (sortType === "name") return a.chapter_name.localeCompare(b.chapter_name) * modifier;
            if (sortType === "count") return (a.questionCount - b.questionCount) * modifier;
        });


    const exportChaptersCSV = () => {
        const headers = ["#", "Chapter", "Subject", "Questions"];
        const rows = chapters.map((ch) => [
            ch.chapter_number,
            ch.chapter_name,
            ch.subject_id.subject_name,
            ch.questionCount || 0,
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((row) => row.join(",")).join("\n");

        const now = new Date();
        const filename = `chapters_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}.csv`;

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <ChaptersSkeleton />;


    return (
        <div className="px-6 text-white">
            <div className="flex justify-between items-center">

                <h2 className="font-bold">All Chapters</h2>


                <div className="flex gap-2 flex-">

                    <button
                        onClick={() => openModal()}
                        className="px-4 py-2 border border-white/30 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-2"
                    >
                        <FaPlus /> Add Chapter
                    </button>
                    <button onClick={exportChaptersCSV} className="bg-white/10 px-5 py-2 border flex gap-2 justify-between items-center border-white/30 text-white rounded-full">
                        <FaFileExport /> Export CSV
                    </button>
                </div>
            </div>



            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3 flex-1">
                    <div className="flex items-center bg-white/10 text-white border border-white/30 rounded-full px-4 py-2 w-full max-w-sm">
                        <FaSearch className="text-white/70 mr-2" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent focus:outline-none text-sm placeholder-white/50 w-full "
                        />
                    </div>
                    <select
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-full focus:outline-none focus:border-white/50 text-white"
                    >
                        <option className="text-black/50" value="">Filter by subject</option>
                        {subjects.map((subj) => (
                            <option className="text-black/70 " key={subj._id} value={subj.subject_name}>
                                {subj.subject_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 items-center mb-">
                    <label htmlFor="">Sort by</label>
                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                        className="px-4 py-2 border border-white/30 rounded-full bg-white/10 text-white focus:outline-none"
                    >
                        <option className="text-black/70" value="number">Chapter No</option>
                        <option className="text-black/70" value="name">Name</option>
                        <option className="text-black/70" value="count">Questions</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="px-3 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20"
                    >
                        {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                    </button>

                </div>

            </div>

            <div className="rounded-2xl h-[75vh] overflow-hidden overflow-y-auto border border-white/30">
                <table className="w-full  border border-white/10 text-sm">
                    <thead className="bg-purple-800 text-white/90">
                        <tr>
                            <th className="p-3 text-left">#</th>
                            <th className="p-3 text-left">Chapter</th>
                            <th className="p-3 text-left">Questions</th>
                            <th className="p-3 text-left">Subject</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFiltered.map((ch) => (
                            <tr
                                key={ch._id}
                                className="border-t border-white/10 hover:bg-white/10 transition"
                            >
                                <td className="p-3">{ch.chapter_number}</td>
                                <td className="p-3">{ch.chapter_name}</td>
                                <td className="p-3">{ch.questionCount || 0}</td>
                                <td className="p-3">{ch.subject_id.subject_name}</td>
                                <td className="p-3 text-right space-x-2">
                                    <button
                                        onClick={() => openModal(ch)}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ch._id)}
                                        className="p-2 bg-red-600 hover:bg-red-700 rounded"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {sortedFiltered.length === 0 && (
                    <div className="bg-white/10 rounded-xl p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-medium text-white/50 mb-2">No Chapters found</h3>
                        <p className="text-white/50 ">Try adjusting your search or create a new chapter</p>
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-white text-black p-6 rounded-lg w-full max-w-md shadow-2xl"
                    >
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                {current ? "Edit Chapter" : "Add Chapter"}
                            </h2>
                            <button onClick={() => setModalOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Chapter Name</label>
                                <input
                                    type="text"
                                    value={formData.chapter_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, chapter_name: e.target.value })
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Chapter Number</label>
                                <input
                                    type="number"
                                    value={formData.chapter_number}
                                    onChange={(e) =>
                                        setFormData({ ...formData, chapter_number: e.target.value })
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Subject</label>
                                <select
                                    value={formData.subject_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, subject_id: e.target.value })
                                    }
                                    className="w-full border p-2 rounded"
                                >
                                    <option value="">-- Select Subject --</option>
                                    {subjects.map((subj) => (
                                        <option key={subj._id} value={subj._id}>
                                            {subj.subject_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={handleSave}
                                disabled={saveLoading}
                                className={`px-4 py-2 rounded text-white transition ${saveLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                                {saveLoading ? (current ? "Updating..." : "Creating...") : (current ? "Update" : "Create")}
                            </button>

                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Chapters;
