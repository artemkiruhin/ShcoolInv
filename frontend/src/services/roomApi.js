import apiClient from './apiClient';

/**
 * API functions for room management
 */
const roomApi = {
    /**
     * Create a new room
     * @param {Object} roomData - Room data object
     * @returns {Promise} - Created room
     */
    createRoom: (roomData) => {
        return apiClient.post('/rooms/', roomData);
    },

    /**
     * Get all rooms
     * @returns {Promise} - Array of rooms
     */
    getRooms: () => {
        return apiClient.get('/rooms/');
    },

    /**
     * Get room by ID
     * @param {number} roomId - Room ID
     * @returns {Promise} - Room object
     */
    getRoomById: (roomId) => {
        return apiClient.get(`/rooms/${roomId}`);
    },

    /**
     * Update room information
     * @param {number} roomId - Room ID
     * @param {Object} roomData - Updated room data
     * @returns {Promise} - Updated room object
     */
    updateRoom: (roomId, roomData) => {
        return apiClient.put(`/rooms/${roomId}`, roomData);
    },

    /**
     * Delete a room
     * @param {number} roomId - Room ID
     * @returns {Promise} - Success message
     */
    deleteRoom: (roomId) => {
        return apiClient.delete(`/rooms/${roomId}`);
    }
};

export default roomApi;