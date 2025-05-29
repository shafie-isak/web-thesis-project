import axios from 'axios'
const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});


export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return res.json(); // returns { token, user }
};

export const fetchDashboardData = async (token) => {
  const res = await fetch(`${API_BASE}/admin/dashboard-summary`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return await res.json();
};

export const getTopUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/users/top`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch top users");
  return res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/users/all`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export const updateUser = (id, data) => axios.put(`${API_BASE}/users/${id}`, data, { headers });
export const deleteUser = (id) => axios.delete(`${API_BASE}/users/${id}`, { headers });
export const banUser = (id) => axios.put(`${API_BASE}/users/${id}/ban`, {}, { headers });




//Chapters API calls Starts hee

//Get All Chapters
export const fetchChapters = async () => {
  const res = await axios.get(`${API_BASE}/chapters`, { headers: getAuthHeaders() });
  return res.data.chapters;
};

////Get All Subjects
export const fetchSubjects = async () => {
  const res = await axios.get(`${API_BASE}/subjects`, { headers: getAuthHeaders() });
  return res.data.subjects;
};

//Add Chapter
export const createChapter = async (data) => {
  const res = await axios.post(`${API_BASE}/chapters`, data, { headers: getAuthHeaders() });
  return res.data;
};

//Update Chapter
export const updateChapter = async (id, data) => {
  const res = await axios.put(`${API_BASE}/chapters/${id}`, data, { headers: getAuthHeaders() });
  return res.data;
};

//Delete Chapter
export const deleteChapter = async (id) => {
  const res = await axios.delete(`${API_BASE}/chapters/${id}`, { headers: getAuthHeaders() });
  return res.data;
};



//Questions API calls Starts hee

//Get all Questions
export const fetchQuestions = async () => {
  const res = await axios.get(`${API_BASE}/questions`, { headers: getAuthHeaders() });
  return res.data.questions;
};

//Add question
export const createQuestion = async (data) => {
  const res = await axios.post(`${API_BASE}/questions`, data, { headers: getAuthHeaders() });
  return res.data;
};

//Update question
export const updateQuestion = async (id, data) => {
  const res = await axios.put(`${API_BASE}/questions/${id}`, data, { headers: getAuthHeaders() });
  return res.data;
};

//Delete question
export const deleteQuestion = async (id) => {
  const res = await axios.delete(`${API_BASE}/questions/${id}`, { headers: getAuthHeaders() });
  return res.data;
};



// Mock Exams API

// Get all mock exams
export const fetchMockExams = async () => {
  const res = await axios.get(`${API_BASE}/mockexams`, { headers: getAuthHeaders() });
  return res.data;
};

// Create a new mock exam
export const createMockExam = async (data) => {
  const res = await axios.post(`${API_BASE}/mockexams`, data, { headers: getAuthHeaders() });
  return res.data;
};

// Delete a mock exam
export const deleteMockExam = async (id) => {
  const res = await axios.delete(`${API_BASE}/mockexams/${id}`, { headers: getAuthHeaders() });
  return res.data;
};
