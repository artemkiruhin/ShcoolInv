import apiClient, {API_BASE_URL} from './apiClient';

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


    increaseConsumable: async (consumableId, amount) => {
        try {
            console.log(consumableId);
            console.log(amount);
            const response = await fetch(`${API_BASE_URL}/consumables/increase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: consumableId,
                    amount: amount
                })
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to increase quantity');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    decreaseConsumable: async (id, amount) => {
        const response = await fetch(`${API_BASE_URL}/consumables/decrease`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                amount: amount
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail);
        }

        return await response.json();
    }

};

export default consumableApi;