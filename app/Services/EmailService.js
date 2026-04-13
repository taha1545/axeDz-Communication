const db = require('../../db/models');
const { EmailLog, UsageEvent } = db;
const queuePublisher = require('../../queues/publisher');
const config = require('../../config/rabbitmq');
const logger = require('../../config/logger');

class EmailService {
  async sendEmail(apiKeyRecord, toEmail, subject, message, body_type = 'text') {
    //
    const cost = parseFloat(process.env.EMAIL_COST) || 0.01;

    const result = await db.sequelize.transaction(async (transaction) => {
      // Create email log
      const emailLog = await EmailLog.create({
        api_key_id: apiKeyRecord,
        to_email: toEmail,
        subject,
        body: message,
        body_type,
      }, { transaction });
      // Log usage event
      await UsageEvent.create({
        api_key_id: apiKeyRecord,
        service_type: 'email',
        unit_cost: cost,
        quantity: 1,
        total_cost: cost,
        reference_id: emailLog.id,
      }, { transaction });

      return emailLog;
    });
    // Publish to queue 
    try {
      await queuePublisher.publish(config.queues.email, {
        id: result.id,
        to_email: toEmail,
        subject,
        message,
        body_type,
        api_key_id: apiKeyRecord,
        retry_count: 0,
      });
    } catch (error) {
      logger.error('Failed to publish email to queue', error);
    }

    return { id: result.id, status: 'queued' };
  }
}

module.exports = new EmailService();