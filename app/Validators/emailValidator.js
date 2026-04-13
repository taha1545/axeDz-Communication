const { body } = require('express-validator');

const sendEmailValidator = [
  body('to_email')
    .exists({ checkFalsy: true })
    .withMessage('to_email is required')
    .bail()
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),
  body('subject')
    .exists({ checkFalsy: true })
    .withMessage('subject is required')
    .bail()
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage('Subject must be between 1 and 150 characters'),
  body('message')
    .exists({ checkFalsy: true })
    .withMessage('message is required')
    .bail()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must not exceed 1000 characters')
    .trim(),
  body('body_type')
    .optional()
    .trim()
    .isIn(['text', 'html'])
    .withMessage('body_type must be either text or html'),
];

module.exports = { sendEmailValidator };