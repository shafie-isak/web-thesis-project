// pages/Challenges.jsx
import React, { useEffect, useState } from "react";
import {
    fetchChallenges,
    createChallenge,
    updateChallenge,
    deleteChallenge,
} from "../utils/api";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const initialForm = {
    type: "daily",
    description: "",
    timeLimit: 120,
    numberOfQuestions: 10,
    startDate: "",
    endDate: "",
};

const Challenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadChallenges();
    }, []);

    const loadChallenges = async () => {
        setIsLoading(true);
        try {
            const data = await fetchChallenges();
            setChallenges(data);
        } catch (error) {
            toast.error("Failed to load challenges");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editId) {
                await updateChallenge(editId, form);
                toast.success("✅ Challenge updated successfully");
            } else {
                await createChallenge(form);
                toast.success("✅ Challenge created successfully");
            }
            setForm(initialForm);
            setEditId(null);
            setShowForm(false);
            loadChallenges();
        } catch (err) {
            toast.error("❌ Failed to save challenge");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (ch) => {
        setForm({
            ...ch,
            numberOfQuestions: ch.questionIds.length,
            startDate: ch.startDate?.slice(0, 16),
            endDate: ch.endDate?.slice(0, 16),
        });
        setEditId(ch._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Challenge?",
            text: "This will permanently delete the challenge and all its results!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            background: "#1f2937",
            color: "#fff",
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                await deleteChallenge(id);
                toast.success("🗑️ Challenge deleted successfully");
                loadChallenges();
            } catch (error) {
                toast.error("Failed to delete challenge");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const filtered = challenges.filter((ch) => {
        const matchSearch = ch.title.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType ? ch.type === filterType : true;
        const matchDate = filterDate ? ch.startDate?.slice(0, 10) === filterDate : true;
        return matchSearch && matchType && matchDate;
    });

    const getChallengeColor = (type) => {
        return type === "daily" ? "bg-blue-600" : "bg-purple-600";
    };

    return (
        <div className="px-6 h-[87.5vh] overflow-hidden flex flex-col">
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-3xl font-bold text-white">
                        <span className="text-white">
                            Challenge Management
                        </span>
                    </h2>

                    <button
                        className="flex items-center gap-2 bg-white/10 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
                        onClick={() => {
                            setShowForm(true);
                            setEditId(null);
                            setForm(initialForm);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create Challenge
                    </button>
                </div>

                <div className="bg-white/10 rounded-xl p-3 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                placeholder="Search challenges..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                        </div>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white/10 border border-white/30 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-white/30 px-3 py-2"
                        >
                            <option value="">All Challenge Types</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>

                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="bg-white/10 border border-white/30 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-white/30 px-3 py-2"
                        />

                        <button
                            onClick={() => {
                                setSearch("");
                                setFilterType("");
                                setFilterDate("");
                            }}
                            className="bg-white/10 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-white text-gray-800 p-6 rounded-xl w-full max-w-2xl shadow-2xl animate-slideUp border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">
                                    {editId ? "Update Challenge" : "Create New Challenge"}
                                </h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Type</label>
                                        <select
                                            value={form.type}
                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                            className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="daily">Daily Challenge</option>
                                            <option value="weekly">Weekly Challenge</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <input
                                            placeholder="Enter challenge description"
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (seconds)</label>
                                        <input
                                            type="number"
                                            placeholder="Enter time limit"
                                            value={form.timeLimit}
                                            onChange={(e) => setForm({ ...form, timeLimit: e.target.value })}
                                            className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                                        <input
                                            type="number"
                                            placeholder="Enter number of questions"
                                            value={form.numberOfQuestions}
                                            onChange={(e) => setForm({ ...form, numberOfQuestions: e.target.value })}
                                            className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            value={form.startDate}
                                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                            className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            value={form.endDate}
                                            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                            className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-8">
                                    <button
                                        type="button"
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`px-6 py-3 bg-[#7A4DDF] hover:bg-[#613abe] text-white rounded-lg transition-all duration-200 flex items-center justify-center min-w-32 ${isLoading ? 'opacity-75' : ''}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : editId ? "Update Challenge" : "Create Challenge"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {isLoading && challenges.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/50"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 h-[68vh] overflow-hidden overflow-y-auto lg:grid-cols-3 gap-6 pb-8">
                                {filtered.map((ch) => (
                                    <div
                                        key={ch._id}
                                        className="bg-white/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-white/30"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-xl text-white">{ch.title}</h3>
                                            <span className={`${getChallengeColor(ch.type)} text-white text-xs px-2 py-1 rounded-full`}>
                                                {ch.type}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-4">{ch.description}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-white/10 p-3 rounded-lg">
                                                <div className="text-xs text-white/50">Time Limit</div>
                                                <div className="font-medium text-white">{ch.timeLimit} seconds</div>
                                            </div>
                                            <div className="bg-white/10 p-3 rounded-lg">
                                                <div className="text-xs text-white/50">Questions</div>
                                                <div className="font-medium text-white">{ch.questionIds.length}</div>
                                            </div>
                                            <div className="bg-white/10 p-3 rounded-lg">
                                                <div className="text-xs text-white/50">Users Attempted</div>
                                                <div className="font-medium text-white">{ch.participantCount || 0}</div>
                                            </div>

                                        </div>

                                        <div className="text-sm text-white/50 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(ch.startDate).toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(ch.endDate).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEdit(ch)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ch._id)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filtered.length === 0 && (
                                <div className="bg-white/10 rounded-xl p-8 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-xl font-medium text-white/50 mb-2">No challenges found</h3>
                                    <p className="text-white/50 ">Try adjusting your search or create a new challenge</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Challenges;