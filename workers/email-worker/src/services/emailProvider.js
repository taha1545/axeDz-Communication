const nodemailer = require('nodemailer');
const logger = require('../config/logger');
const emailConfig = require('../config/email');

class EmailProvider {
  async send({ to_email, subject, message, body_type = 'text' }) {
    return true;
  }
}

module.exports = new EmailProvider();
