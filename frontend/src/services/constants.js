/**
 * Constants used throughout the application
 */

export const INVENTORY_CONDITIONS = {
    NORMAL: 'Нормальное',
    REQUIRES_REPAIR: 'Требует ремонта',
    WRITTEN_OFF: 'Списано'
};

export const LOG_TYPES = {
    INFO: 1,
    WARNING: 2,
    ERROR: 3,
    CRITICAL: 4
};

export const ERROR_MESSAGES = {
    GENERAL: 'An error occurred. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.'
};

/**
 * Report types enum matching the backend
 */
export const ReportType = {
    USERS: "users",
    ROOMS: "rooms",
    INVENTORY_CATEGORIES: "inventory_categories",
    INVENTORY_ITEMS: "inventory_items",
    CONSUMABLES: "consumables",
    LOGS: "logs",
    LOW_STOCK: "low_stock",
    INVENTORY_BY_CONDITION: "inventory_by_condition"
};

export default {
    INVENTORY_CONDITIONS,
    LOG_TYPES,
    ERROR_MESSAGES,
    ReportType
};