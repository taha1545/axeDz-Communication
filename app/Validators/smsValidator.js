const { body } = require('express-validator');

const sendSmsValidator = [
  body('to_number')
    .exists({ checkFalsy: true })
    .withMessage('to_number is required')
    .bail()
    .trim()
    .isMobilePhone('any')
    .withMessage('Invalid phone number'),
  body('message')
    .exists({ checkFalsy: true })
    .withMessage('message is required')
    .bail()
    .isLength({ min: 1, max: 160 })
    .withMessage('Message must be between 1 and 160 characters')
    .trim(),
];

module.exports = { sendSmsValidator };