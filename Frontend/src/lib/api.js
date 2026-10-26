const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('craftcv_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.response = { status: response.status, data };
    throw error;
  }

  return data;
};

export const authApi = {
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request('/auth/me'),
};

export const portfolioApi = {
  list: (userId) => request(`/portfolios${userId ? `?userId=${userId}` : ''}`),
  get: (id) => request(`/portfolios/${id}`),
  save: (data) =>
    request('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/portfolios/${id}`, {
      method: 'DELETE',
    }),
};

export const githubApi = {
  ingest: (username) => request(`/github/${encodeURIComponent(username)}`),
};

export const agentApi = {
  command: (instruction, currentResume, apiKey) =>
    request('/agent/command', {
      method: 'POST',
      body: JSON.stringify({ instruction, currentResume, apiKey }),
    }),
  generateInterview: async (resumeData, targetRole, interviewType, file = null, existingQuestions = [], questionCount = 4) => {
    if (file) {
      const formData = new FormData();
      formData.append('resumePdf', file);
      formData.append('targetRole', targetRole || 'Software Engineer');
      formData.append('interviewType', interviewType || 'viva');
      formData.append('questionCount', questionCount.toString());
      if (existingQuestions && existingQuestions.length > 0) {
        formData.append('existingQuestions', JSON.stringify(existingQuestions));
      }
      if (resumeData) formData.append('resumeData', JSON.stringify(resumeData));

      const token = localStorage.getItem('craftcv_token');
      const response = await fetch(`${API_BASE}/agent/interview`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to generate interview');
      return data;
    }

    return request('/agent/interview', {
      method: 'POST',
      body: JSON.stringify({ resumeData, targetRole, interviewType, existingQuestions, questionCount }),
    });
  },
  evaluateAnswer: (question, candidateAnswer, targetRole) =>
    request('/agent/evaluate-answer', {
      method: 'POST',
      body: JSON.stringify({ question, candidateAnswer, targetRole }),
    }),
};

export default { authApi, portfolioApi, githubApi, agentApi };
