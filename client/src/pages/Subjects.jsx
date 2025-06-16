import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSortAlphaDown,
    FaTimes,
    FaSearch,
    FaFileExport,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from 'sweetalert2';
import SubjectsSkeleton from "../components/skeletons/SubjectsSkeleton";



const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [formData, setFormData] = useState({ subject_name: "", icon: "" });
    const [saveLoading, setSaveLoading] = useState(false);


    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [searchTerm, setSearchTerm] = useState('');

    const fetchSubjects = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/subjects", {
                headers,
            });
            setSubjects(res.data.subjects);
        } catch (err) {
            console.error("Error loading subjects:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleSort = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        setSubjects([...subjects].sort((a, b) =>
            newOrder === "asc"
                ? a.subject_name.localeCompare(b.subject_name)
                : b.subject_name.localeCompare(a.subject_name)
        ));
    };

    const openEditModal = (subject = null) => {
        setCurrentSubject(subject);
        if (subject) {
            setFormData({ subject_name: subject.subject_name, icon: subject.icon });
        } else {
            setFormData({ subject_name: "", icon: "" });
        }
        setEditModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.subject_name || !formData.icon) {
            toast.warning("Please provide both name and icon.");
            return;
        }

        setSaveLoading(true); // start loading

        try {
            if (currentSubject) {
                await axios.put(
                    `http://localhost:5000/api/subjects/${currentSubject._id}`,
                    formData,
                    { headers }
                );
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Subject updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                const res = await axios.post(
                    `http://localhost:5000/api/subjects`,
                    formData,
                    { headers }
                );
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Subject created successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

            fetchSubjects();
            setEditModalOpen(false);
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error("Subject already exists.");
            } else {
                toast.error("❌ Save failed: " + err.message);
            }
        } finally {
            setSaveLoading(false); // stop loading
        }
    };




    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action will delete the subject permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7A4DDF',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Show loading indicator
                Swal.fire({
                    title: 'Deleting...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                try {
                    const res = await axios.delete(`http://localhost:5000/api/subjects/${id}`, {
                        headers,
                    });

                    Swal.close();
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'The subject has been successfully deleted.',
                        timer: 1500,
                        showConfirmButton: false,
                        timerProgressBar: true
                    });
                    fetchSubjects();
                } catch (err) {
                    Swal.close(); 
                    if (err.response?.status === 400) {
                        toast.error("Subject is referenced by another entity.");
                    } else {
                        toast.error("Delete failed: " + err.message);
                    }
                }
            }
        });
    };



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () =>
                setFormData({ ...formData, icon: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const searchResults = subjects.filter((subject) =>
        subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportCSV = () => {
        const headers = ["Name", "Icon"];
        const rows = subjects.map((subj) => [
            subj.subject_name,
            subj.icon.slice(0, 30) + "...",
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((e) => e.join(",")).join("\n");

        const now = new Date();
        const fileName = `subjects_${now.getFullYear()}_${now.getMonth() + 1
            }_${now.getDate()}.csv`;

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

       if(loading) return <SubjectsSkeleton/>;

    return (
        <div className="p-6 h-[86vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between flex-wrap items-center mb-6">
                <div className="flex items-center bg-white/10 text-white border border-white/30 rounded-full px-4 py-2 w-full max-w-sm">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent focus:outline-none text-sm placeholder-gray-400 w-full"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => openEditModal()}
                        className="bg-white/10 px-5 py-2 border flex gap-2 items-center border-white/30 text-white rounded-full"
                    >
                        <FaPlus /> Add Subject
                    </button>
                    <button
                        onClick={exportCSV}
                        className="bg-white/10 px-5 py-2 border flex gap-2 items-center border-white/30 text-white rounded-full"
                    >
                        <FaFileExport /> Export CSV
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-white">All Subjects</h1>
                <button
                    onClick={handleSort}
                    className="flex items-center gap-2 text-white/50 hover:text-white/30"
                >
                    <FaSortAlphaDown /> Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </button>
            </div>

            {/* Subjects Grid */}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2 rounded-xl h-[68.3vh] overflow-y-auto">
                    {searchResults.map((subject) => (
                        <motion.div
                            key={subject._id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/10 backdrop-blur-xl rounded-lg shadow-md p-4 flex items-center justify-between border border-white/30"
                        >
                            <div className="flex items-center h-11 gap-3">
                                <img
                                    src={subject.icon}
                                    alt={subject.subject_name}
                                    className="w-10 h-10 object-contain"
                                />
                                <span className="font-medium text-white">{subject.subject_name}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(subject)}
                                    className="text-blue-500 hover:text-blue-700 bg-blue-900/20 p-2 rounded"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(subject._id)}
                                    className="text-red-500 hover:text-red-700 bg-red-900/20 p-2 rounded"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

            {/* Edit/Add Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                {currentSubject ? "Edit Subject" : "Add Subject"}
                            </h2>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Icon
                                </label>
                                <div className="flex items-center gap-3">
                                    {formData.icon ? (
                                        <img
                                            src={formData.icon}
                                            alt="Icon"
                                            className="w-16 h-16 object-contain border rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-400 text-sm">No icon</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="icon-upload"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="icon-upload"
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm cursor-pointer transition"
                                    >
                                        Change
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, subject_name: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saveLoading}
                                className={`px-4 py-2 rounded-md text-white transition ${saveLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                                {saveLoading ? (currentSubject ? "Updating..." : "Creating...") : (currentSubject ? "Update" : "Create")}
                            </button>

                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Subjects;
