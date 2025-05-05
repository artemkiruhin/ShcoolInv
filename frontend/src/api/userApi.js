import apiClient from './apiClient';

/**
 * API functions for user management
 */
const userApi = {
    /**
     * Create a new user
     * @param {Object} userData - User data object
     * @returns {Promise} - Created user
     */
    createUser: (userData) => {
        return apiClient.post('/users/', userData);
    },

    /**
     * Get all users with pagination
     * @param {number} skip - Number of records to skip
     * @param {number} limit - Maximum number of records to return
     * @returns {Promise} - Array of users
     */
    getUsers: (skip = 0, limit = 100) => {
        return apiClient.get(`/users/?skip=${skip}&limit=${limit}`);
    },

    /**
     * Get user by ID
     * @param {number} userId - User ID
     * @returns {Promise} - User object
     */
    getUserById: (userId) => {
        return apiClient.get(`/users/${userId}`);
    },

    /**
     * Update user information
     * @param {number} userId - User ID
     * @param {Object} userData - Updated user data
     * @returns {Promise} - Updated user object
     */
    updateUser: (userId, userData) => {
        return apiClient.put(`/users/${userId}`, userData);
    },

    /**
     * Delete a user
     * @param {number} userId - User ID
     * @returns {Promise} - Success message
     */
    deleteUser: (userId) => {
        return apiClient.delete(`/users/${userId}`);
    }
};

export default userApi;