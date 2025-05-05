import apiClient from './apiClient';

/**
 * API functions for system logs management
 */
const logApi = {
    /**
     * Get all logs with pagination
     * @param {number} skip - Number of records to skip
     * @param {number} limit - Maximum number of records to return
     * @returns {Promise} - Array of logs
     */
    getLogs: (skip = 0, limit = 100) => {
        return apiClient.get(`/logs/?skip=${skip}&limit=${limit}`);
    },

    /**
     * Get log by ID
     * @param {number} logId - Log ID
     * @returns {Promise} - Log object
     */
    getLogById: (logId) => {
        return apiClient.get(`/logs/${logId}`);
    }
};

export default logApi;