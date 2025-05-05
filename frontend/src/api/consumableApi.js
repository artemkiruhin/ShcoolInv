import apiClient from './apiClient';

/**
 * API functions for consumable items management
 */
const consumableApi = {
    /**
     * Create a new consumable item
     * @param {Object} consumableData - Consumable data object
     * @returns {Promise} - Created consumable
     */
    createConsumable: (consumableData) => {
        return apiClient.post('/consumables/', consumableData);
    },

    /**
     * Get all consumable items
     * @returns {Promise} - Array of consumables
     */
    getConsumables: () => {
        return apiClient.get('/consumables/');
    },

    /**
     * Get consumables with low stock (quantity <= min_quantity)
     * @returns {Promise} - Array of low stock consumables
     */
    getLowStockConsumables: () => {
        return apiClient.get('/consumables/low_stock/');
    },

    /**
     * Get consumable by ID
     * @param {number} consumableId - Consumable ID
     * @returns {Promise} - Consumable object
     */
    getConsumableById: (consumableId) => {
        return apiClient.get(`/consumables/${consumableId}`);
    },

    /**
     * Update consumable information
     * @param {number} consumableId - Consumable ID
     * @param {Object} consumableData - Updated consumable data
     * @returns {Promise} - Updated consumable object
     */
    updateConsumable: (consumableId, consumableData) => {
        return apiClient.put(`/consumables/${consumableId}`, consumableData);
    },

    /**
     * Delete a consumable
     * @param {number} consumableId - Consumable ID
     * @returns {Promise} - Success message
     */
    deleteConsumable: (consumableId) => {
        return apiClient.delete(`/consumables/${consumableId}`);
    },

    /**
     * Increase consumable quantity
     * @param {number} consumableId - Consumable ID
     * @param {number} amount - Amount to increase
     * @returns {Promise} - Success message
     */
    increaseConsumable: (consumableId, amount) => {
        return apiClient.post(`/consumables/${consumableId}/increase`, { amount });
    },

    /**
     * Decrease consumable quantity
     * @param {number} consumableId - Consumable ID
     * @param {number} amount - Amount to decrease
     * @returns {Promise} - Success message
     */
    decreaseConsumable: (consumableId, amount) => {
        return apiClient.post(`/consumables/${consumableId}/decrease`, { amount });
    }
};

export default consumableApi;