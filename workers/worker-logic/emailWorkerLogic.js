const nodemailer = require('nodemailer');
const db = require('../db/models');
const { EmailLog } = db;
const emailConfig = require('../config/email');
const logger = require('../config/logger');

class EmailWorkerLogic {
  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig.transport);
  }

  async sendEmailToProvider({ to_email, subject, message, body_type }) {
    const mailOptions = {
      from: emailConfig.from,
      to: to_email,
      subject,
      [body_type === 'html' ? 'html' : 'text']: message,
    };
    //
    await this.transporter.sendMail(mailOptions);
    return true;
  }

  async markAsSent(id) {
    return EmailLog.update(
      { status: 'sent', sent_at: new Date() },
      { where: { id } }
    );
  }

  async markAsFailed(id, retryCount) {
    return EmailLog.update(
      { status: 'failed', retry_count: retryCount },
      { where: { id } }
    );
  }

  async processEmail(data) {
    const { id, to_email, subject, message, body_type = 'text', retry_count = 0 } = data;
    const success = await this.sendEmailToProvider({ to_email, subject, message, body_type });
    //
    if (success) {
      await this.markAsSent(id);
      logger.info('Email sent successfully', { id });
      return;
    }
    //
    await this.markAsFailed(id, retry_count + 1);
    throw new Error('Email sending failed');
  }

  shouldRetry(data) {
    return data.retry_count < 3;
  }
}

module.exports = new EmailWorkerLogic();