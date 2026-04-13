const { query } = require('express-validator');

const getUsageEventsValidator = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be a number between 1 and 100')
        .toInt(),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a non-negative integer')
        .toInt(),
];

module.exports = {
    getUsageEventsValidator,
};