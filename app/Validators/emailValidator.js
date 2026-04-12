const { body } = require('express-validator');

const sendEmailValidator = [
  body('to_email')
    .isEmail()
    .withMessage('Invalid email address'),
  body('subject')
    .isLength({ min: 1, max: 100 })
    .withMessage('Subject must be between 1 and 100 characters'),
  body('message')
    .isLength({ min: 1 })
    .withMessage('Message is required'),
];

module.exports = { sendEmailValidator };