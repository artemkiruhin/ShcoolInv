import apiClient from './apiClient';

/**
 * API functions for inventory item management
 */
const inventoryItemApi = {
    /**
     * Create a new inventory item
     * @param {Object} itemData - Item data object
     * @returns {Promise} - Created item
     */
    createItem: (itemData) => {
        return apiClient.post('/inventory/items/', itemData);
    },

    /**
     * Get all inventory items with pagination
     * @param {number} skip - Number of records to skip
     * @param {number} limit - Maximum number of records to return
     * @returns {Promise} - Array of items
     */
    getItems: (skip = 0, limit = 100) => {
        return apiClient.get(`/inventory/items/?skip=${skip}&limit=${limit}`);
    },

    getAll: () => {
        return apiClient.get(`/inventory/items/`);
    },

    /**
     * Get item by ID
     * @param {number} itemId - Item ID
     * @returns {Promise} - Item object
     */
    getItemById: (itemId) => {
        return apiClient.get(`/inventory/items/${itemId}`);
    },

    /**
     * Get items by condition
     * @param {string} condition - Condition type (NORMAL, REQUIRES_REPAIR, WRITTEN_OFF)
     * @returns {Promise} - Array of items with specified condition
     */
    getItemsByCondition: (condition) => {
        return apiClient.get(`/inventory/items/condition/${condition}`);
    },

    /**
     * Update item information
     * @param {number} itemId - Item ID
     * @param {Object} itemData - Updated item data
     * @returns {Promise} - Updated item object
     */
    updateItem: (itemId, itemData) => {
        return apiClient.put(`/inventory/items/${itemId}`, itemData);
    },

    /**
     * Delete an item
     * @param {number} itemId - Item ID
     * @returns {Promise} - Success message
     */
    deleteItem: (itemId) => {
        return apiClient.delete(`/inventory/items/${itemId}`);
    },

    /**
     * Write off an inventory item
     * @param {number} itemId - Item ID
     * @returns {Promise} - Updated item with WRITTEN_OFF status
     */
    writeOffItem: (itemId) => {
        return apiClient.post(`/inventory/items/${itemId}/write_off`);
    }
};

export default inventoryItemApi;