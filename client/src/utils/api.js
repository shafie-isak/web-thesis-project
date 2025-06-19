import axios from 'axios'
const API_BASE = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});


export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json(); // 👈 extract actual error response

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    // This ensures a clear error message is returned
    throw new Error(error.message || "Network error");
  }
};


export const fetchDashboardData = async (token) => {
  const res = await fetch(`${API_BASE}/api/admin/dashboard-summary`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return await res.json();
};

export const getTopUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/users/top`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch top users");
  return res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/api/users/all`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export const updateUser = (id, data) => axios.put(`${API_BASE}/api/users/${id}`, data, { headers });
export const deleteUser = (id) => axios.delete(`${API_BASE}/api/users/${id}`, { headers });
export const banUser = (id) => axios.put(`${API_BASE}/api/users/${id}/ban`, {}, { headers });



// User Activities API
export const fetchAllActivities = async () => {
  const res = await axios.get(`${API_BASE}/api/activities/all`, { headers: getAuthHeaders() });
  return res.data.activities;
};

export const fetchActivityStats = async () => {
  const res = await axios.get(`${API_BASE}/api/activities/stats/daily`, { headers: getAuthHeaders() });
  return res.data;
};




//Chapters API calls Starts hee

//Get All Chapters
export const fetchChapters = async () => {
  const res = await axios.get(`${API_BASE}/api/chapters`, { headers: getAuthHeaders() });
  return res.data.chapters;
};
export const fetchChaptersBySubject = async (id) => {
  const res = await axios.get(`${API_BASE}/api/chapters/by-subject/${id}`, { headers: getAuthHeaders() });
  return res.data.chapters;
};

////Get All Subjects
export const fetchSubjects = async () => {
  const res = await axios.get(`${API_BASE}/api/subjects`, { headers: getAuthHeaders() });
  return res.data.subjects;
};

//Add Chapter
export const createChapter = async (data) => {
  const res = await axios.post(`${API_BASE}/api/chapters`, data, { headers: getAuthHeaders() });
  return res.data;
};

//Update Chapter
export const updateChapter = async (id, data) => {
  const res = await axios.put(`${API_BASE}/api/chapters/${id}`, data, { headers: getAuthHeaders() });
  return res.data;
};

//Delete Chapter
export const deleteChapter = async (id) => {
  const res = await axios.delete(`${API_BASE}/api/chapters/${id}`, { headers: getAuthHeaders() });
  return res.data;
};



//Questions API calls Starts hee

//Get all Questions
export const fetchQuestions = async ({ subjectId, chapterId, page = 1, limit = 50 }) => {
  const params = {};

  if (subjectId) params.subject = subjectId;
  if (chapterId) params.chapter = chapterId;
  params.page = page;
  params.limit = limit;

  const res = await axios.get(`${API_BASE}/api/questions`, {
    headers: getAuthHeaders(),
    params
  });

  return res.data;
};


//Add question
export const createQuestion = async (data) => {
  const res = await axios.post(`${API_BASE}/api/questions`, data, { headers: getAuthHeaders() });
  return res.data;
};

//Update question
export const updateQuestion = async (id, data) => {
  const res = await axios.put(`${API_BASE}/api/questions/${id}`, data, { headers: getAuthHeaders() });
  return res.data;
};

//Delete question
export const deleteQuestion = async (id) => {
  const res = await axios.delete(`${API_BASE}/api/questions/${id}`, { headers: getAuthHeaders() });
  return res.data;
};



// Mock Exams API

// Get all mock exams
export const fetchMockExams = async () => {
  const res = await axios.get(`${API_BASE}/api/mockexams`, { headers: getAuthHeaders() });
  return res.data;
};

// Create a new mock exam
export const createMockExam = async (data) => {
  const res = await axios.post(`${API_BASE}/api/mockexams`, data, { headers: getAuthHeaders() });
  return res.data;
};

// Delete a mock exam
export const deleteMockExam = async (id) => {
  const res = await axios.delete(`${API_BASE}/api/mockexams/${id}`, { headers: getAuthHeaders() });
  return res.data;
};



// Challenges API

// Get all Challenges
export const fetchChallenges = async () => {
  const res = await axios.get(`${API_BASE}/api/challenges`, { headers: getAuthHeaders() });
  return res.data;
};


// Create a new challenge
export const createChallenge = async (data) => {
  const res = await axios.post(`${API_BASE}/api/challenges`, data, { headers: getAuthHeaders() });
  return res.data;
};

//Update a challenge
export const updateChallenge = async (id, data) => {
  const res = await axios.put(`${API_BASE}/api/challenges/${id}`, data, { headers: getAuthHeaders() });
  return res.data;
};

//Delete a challenge
export const deleteChallenge = async (id) => {
  const res = await axios.delete(`${API_BASE}/api/challenges/${id}`, { headers: getAuthHeaders() });
  return res.data;
};


// utils/api.js
export const fetchChallengeStats = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/challenges/stats`);
  if (!res.ok) {
    throw new Error("Failed to fetch challenge stats");
  }
  return await res.json();
};
