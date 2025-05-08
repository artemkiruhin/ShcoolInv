import apiClient from './apiClient';

/**
 * API functions for authentication
 */
const authApi = {
    /**
     * Login user with username and password
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise} - Auth response with user data
     */
    login: (username, password) => {
        return apiClient.post('/login', { username, password });
    },

    /**
     * Logout user (clears local storage)
     * Note: This is client-side only, you may want to add an API endpoint for server-side logout
     */
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    },

    /**
     * Get stored user data from local storage
     * @returns {Object|null} - Parsed user data or null if not logged in
     */
    getCurrentUser: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Check if user is authenticated (has valid token)
     * @returns {boolean} - True if authenticated
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },

    /**
     * Check if current user is admin
     * @returns {boolean} - True if user is admin
     */
    isAdmin: () => {
        const user = authApi.getCurrentUser();
        return user ? user.is_admin : false;
    }
};

export default authApi;