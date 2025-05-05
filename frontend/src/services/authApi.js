import apiClient from './apiClient';

/**
 * API functions for authentication
 * Note: This is a placeholder for auth endpoints which are not explicitly defined in your FastAPI code
 * You'll need to adjust this to match your actual authentication implementation
 */
const authApi = {
    /**
     * Login with username and password
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise} - Auth token and user info
     */
    login: (username, password) => {
        return apiClient.post('/auth/login', { username, password });
    },

    /**
     * Logout the current user
     * @returns {Promise} - Success message
     */
    logout: () => {
        return apiClient.post('/auth/logout');
    },

    /**
     * Get the current authenticated user
     * @returns {Promise} - Current user info
     */
    getCurrentUser: () => {
        return apiClient.get('/auth/me');
    },

    /**
     * Change user password
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise} - Success message
     */
    changePassword: (oldPassword, newPassword) => {
        return apiClient.post('/auth/change-password', {
            old_password: oldPassword,
            new_password: newPassword
        });
    },

    /**
     * Check if auth token is valid
     * @returns {Promise} - Token validity status
     */
    validateToken: () => {
        return apiClient.get('/auth/validate');
    }
};

export default authApi;