const { body } = require('express-validator');

const sendSmsValidator = [
  body('to_number')
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  body('message')
    .isLength({ min: 1, max: 160 })
    .withMessage('Message must be between 1 and 160 characters'),
];

module.exports = { sendSmsValidator };