const API_BASE_URL = '/api';

/**
 * Helper to get the saved token
 */
export const getToken = () => localStorage.getItem('sms_auth_token');

/**
 * Base fetch wrapper with error handling and Authorization header
 */
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Authentication API methods
export const authApi = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  getMe: () => request('/auth/me')
};

// Students API methods
export const studentApi = {
  /**
   * Fetch all students with optional filters, search, sort, and pagination
   */
  getStudents: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return request(`/students${queryString ? `?${queryString}` : ''}`);
  },

  getStudentById: (id) => request(`/students/${id}`),

  createStudent: (studentData) =>
    request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    }),

  updateStudent: (id, studentData) =>
    request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    }),

  deleteStudent: (id) =>
    request(`/students/${id}`, {
      method: 'DELETE'
    })
};
