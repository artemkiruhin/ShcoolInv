import apiClient from './apiClient';

/**
 * API functions for inventory category management
 */
const categoryApi = {
    /**
     * Create a new inventory category
     * @param {Object} categoryData - Category data object
     * @returns {Promise} - Created category
     */
    createCategory: (categoryData) => {
        return apiClient.post('/inventory/categories/', categoryData);
    },

    /**
     * Get all inventory categories
     * @returns {Promise} - Array of categories
     */
    getCategories: () => {
        return apiClient.get('/inventory/categories/');
    },

    /**
     * Get category by ID
     * @param {number} categoryId - Category ID
     * @returns {Promise} - Category object
     */
    getCategoryById: (categoryId) => {
        return apiClient.get(`/inventory/categories/${categoryId}`);
    },

    /**
     * Update category information
     * @param {number} categoryId - Category ID
     * @param {Object} categoryData - Updated category data
     * @returns {Promise} - Updated category object
     */
    updateCategory: (categoryId, categoryData) => {
        return apiClient.put(`/inventory/categories/${categoryId}`, categoryData);
    },

    /**
     * Delete a category
     * @param {number} categoryId - Category ID
     * @returns {Promise} - Success message
     */
    deleteCategory: (categoryId) => {
        return apiClient.delete(`/inventory/categories/${categoryId}`);
    }
};

export default categoryApi;