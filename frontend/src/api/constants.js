/**
 * Constants used throughout the application
 */

export const INVENTORY_CONDITIONS = {
    NORMAL: 'NORMAL',
    REQUIRES_REPAIR: 'REQUIRES_REPAIR',
    WRITTEN_OFF: 'WRITTEN_OFF'
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

export default {
    INVENTORY_CONDITIONS,
    LOG_TYPES,
    ERROR_MESSAGES
};