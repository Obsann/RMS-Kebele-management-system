// API configuration and helper functions

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get auth token from localStorage
 */
const getToken = () => localStorage.getItem('token');

/**
 * Set auth token in localStorage
 */
const setToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

/**
 * Get stored user from localStorage
 */
const getStoredUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * Set user in localStorage
 */
const setStoredUser = (user) => {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
};

/**
 * Clear all auth data
 */
const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

/**
 * Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    // Don't stringify body if it's FormData
    if (options.body && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
    } else if (options.body instanceof FormData) {
        // Remove Content-Type for FormData (browser will set it with boundary)
        delete config.headers['Content-Type'];
        config.body = options.body;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 - token expired or invalid
    if (response.status === 401) {
        clearAuth();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
};

// Auth API
export const authAPI = {
    login: async (email, password) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        setToken(data.token);
        setStoredUser(data.user);
        return data;
    },

    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: userData,
        });
    },

    checkUser: async () => {
        return apiRequest('/auth/me');
    },

    changePassword: async (currentPassword, newPassword) => {
        return apiRequest('/auth/change-password', {
            method: 'PUT',
            body: { currentPassword, newPassword },
        });
    },

    logout: () => {
        clearAuth();
    },
};

// Users API
export const usersAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/users${query ? `?${query}` : ''}`);
    },

    getById: async (id) => {
        return apiRequest(`/users/${id}`);
    },

    update: async (id, data) => {
        return apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: data,
        });
    },

    delete: async (id) => {
        return apiRequest(`/users/${id}`, {
            method: 'DELETE',
        });
    },

    updateStatus: async (id, status) => {
        return apiRequest(`/auth/users/${id}/status`, {
            method: 'PATCH',
            body: { status },
        });
    },

    getByRole: async (role) => {
        return apiRequest(`/users/role/${role}`);
    },

    addDependent: async (userId, dependent) => {
        return apiRequest(`/users/${userId}/dependents`, {
            method: 'POST',
            body: dependent,
        });
    },

    removeDependent: async (userId, dependentId) => {
        return apiRequest(`/users/${userId}/dependents/${dependentId}`, {
            method: 'DELETE',
        });
    },
};

// Requests API
export const requestsAPI = {
    create: async (requestData) => {
        return apiRequest('/requests', {
            method: 'POST',
            body: requestData,
        });
    },

    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/requests${query ? `?${query}` : ''}`);
    },

    getById: async (id) => {
        return apiRequest(`/requests/${id}`);
    },

    updateStatus: async (id, status, response) => {
        return apiRequest(`/requests/${id}/status`, {
            method: 'PATCH',
            body: { status, response },
        });
    },

    convertToJob: async (id, data) => {
        return apiRequest(`/requests/${id}/convert-to-job`, {
            method: 'POST',
            body: data,
        });
    },

    delete: async (id) => {
        return apiRequest(`/requests/${id}`, {
            method: 'DELETE',
        });
    },
};

// Jobs API
export const jobsAPI = {
    create: async (jobData) => {
        return apiRequest('/jobs', {
            method: 'POST',
            body: jobData,
        });
    },

    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/jobs${query ? `?${query}` : ''}`);
    },

    getById: async (id) => {
        return apiRequest(`/jobs/${id}`);
    },

    update: async (id, data) => {
        return apiRequest(`/jobs/${id}`, {
            method: 'PUT',
            body: data,
        });
    },

    assign: async (id, employeeId) => {
        return apiRequest(`/jobs/${id}/assign`, {
            method: 'POST',
            body: { employeeId },
        });
    },

    delete: async (id) => {
        return apiRequest(`/jobs/${id}`, {
            method: 'DELETE',
        });
    },

    getStats: async () => {
        return apiRequest('/jobs/stats');
    },
};

// Digital ID API
export const digitalIdAPI = {
    generate: async (userId) => {
        return apiRequest('/digital-id/generate', {
            method: 'POST',
            body: { userId },
        });
    },

    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/digital-id${query ? `?${query}` : ''}`);
    },

    getMine: async () => {
        return apiRequest('/digital-id/me');
    },

    getByUser: async (userId) => {
        return apiRequest(`/digital-id/user/${userId}`);
    },

    approve: async (id) => {
        return apiRequest(`/digital-id/${id}/approve`, {
            method: 'POST',
        });
    },

    revoke: async (id, reason) => {
        return apiRequest(`/digital-id/${id}/revoke`, {
            method: 'POST',
            body: { reason },
        });
    },

    verify: async (qrCode) => {
        return apiRequest('/digital-id/verify', {
            method: 'POST',
            body: { qrCode },
        });
    },

    getStats: async () => {
        return apiRequest('/digital-id/stats');
    },
};

// Uploads API
export const uploadsAPI = {
    upload: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiRequest('/uploads', {
            method: 'POST',
            body: formData,
        });
    },

    getAll: async () => {
        return apiRequest('/uploads');
    },

    delete: async (filename) => {
        return apiRequest(`/uploads/${filename}`, {
            method: 'DELETE',
        });
    },
};

// Notifications API
export const notificationsAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/notifications${query ? `?${query}` : ''}`);
    },

    markAsRead: async (id) => {
        return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
    },

    markAllRead: async () => {
        return apiRequest('/notifications/read-all', { method: 'PATCH' });
    },

    delete: async (id) => {
        return apiRequest(`/notifications/${id}`, { method: 'DELETE' });
    },

    sendAnnouncement: async (data) => {
        return apiRequest('/notifications/announce', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    },
};

// Households API
export const householdsAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/households${query ? `?${query}` : ''}`);
    },

    getById: async (id) => {
        return apiRequest(`/households/${id}`);
    },

    create: async (data) => {
        return apiRequest('/households', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    },

    update: async (id, data) => {
        return apiRequest(`/households/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    },

    addMember: async (id, data) => {
        return apiRequest(`/households/${id}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    },

    removeMember: async (id, memberId) => {
        return apiRequest(`/households/${id}/members/${memberId}`, {
            method: 'DELETE',
        });
    },

    delete: async (id) => {
        return apiRequest(`/households/${id}`, { method: 'DELETE' });
    },
};

// Reports API
export const reportsAPI = {
    getOverview: async () => {
        return apiRequest('/reports/overview');
    },

    getDemographics: async () => {
        return apiRequest('/reports/demographics');
    },

    getRequestReport: async () => {
        return apiRequest('/reports/requests');
    },
};

// Audit API
export const auditAPI = {
    getLogs: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/audit${query ? `?${query}` : ''}`);
    },

    getStats: async () => {
        return apiRequest('/audit/stats');
    },
};

// Export utils
export { getToken, setToken, getStoredUser, setStoredUser, clearAuth };

export default {
    auth: authAPI,
    users: usersAPI,
    requests: requestsAPI,
    jobs: jobsAPI,
    digitalId: digitalIdAPI,
    uploads: uploadsAPI,
    notifications: notificationsAPI,
    households: householdsAPI,
    reports: reportsAPI,
    audit: auditAPI,
};
