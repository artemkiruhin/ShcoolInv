/**
 * Base API client for making HTTP requests
 */
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:1234/api';

/**
 * Helper method to handle API responses and errors consistently
 * @param {Response} response - The fetch response object
 * @returns {Promise} - Resolves to the response data or rejects with error
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.detail || `API error: ${response.status}`);
        } catch (err) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
    }

    if (response.status === 204) {
        return null;
    }

    return await response.json();
};

/**
 * Base request method that all API calls use
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} data - Request body data
 * @returns {Promise} - Response data
 */
const request = async (endpoint, method = 'GET', data = null) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
        credentials: 'include',
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        return await handleResponse(response);
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

export const apiClient = {
    get: (endpoint) => request(endpoint),
    post: (endpoint, data) => request(endpoint, 'POST', data),
    put: (endpoint, data) => request(endpoint, 'PUT', data),
    delete: (endpoint) => request(endpoint, 'DELETE'),
};

export default apiClient;