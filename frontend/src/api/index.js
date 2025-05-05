/**
 * Main API entry point that exports all API modules
 */
import apiClient from './apiClient';
import userApi from './userApi';
import roomApi from './roomApi';
import categoryApi from './categoryApi';
import inventoryItemApi from './inventoryItemApi';
import consumableApi from './consumableApi';
import logApi from './logApi';
import * as constants from './constants';

export {
    apiClient,
    userApi,
    roomApi,
    categoryApi,
    inventoryItemApi,
    consumableApi,
    logApi,
    constants
};

const api = {
    client: apiClient,
    users: userApi,
    rooms: roomApi,
    categories: categoryApi,
    inventoryItems: inventoryItemApi,
    consumables: consumableApi,
    logs: logApi,
    constants
};

export default api;