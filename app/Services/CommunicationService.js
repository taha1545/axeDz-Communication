const { v4: uuidv4 } = require('uuid');
const db = require('../../db/models');
const { ApiKey, SmsLog, EmailLog, UsageEvent } = db;
const queuePublisher = require('../../queues/publisher');
const config = require('../../config/rabbitmq');
const logger = require('../../config/logger');

class CommunicationService {
  async validateApiKey(apiKey) {
    const keyRecord = await ApiKey.findOne({ where: { key: apiKey, is_active: true } });
    if (!keyRecord) {
      throw new Error('Invalid API key');
    }
    return keyRecord;
  }

  async sendSms(apiKey, toNumber, message) {
    const keyRecord = await this.validateApiKey(apiKey);
    const cost = 0.05; // Example cost per SMS

    const smsLog = await SmsLog.create({
      user_id: keyRecord.user_id,
      api_key_id: keyRecord.id,
      to_number: toNumber,
      message,
      cost,
    });

    // Publish to queue
    await queuePublisher.publish(config.queues.sms, {
      id: smsLog.id,
      to_number: toNumber,
      message,
      cost,
      user_id: keyRecord.user_id,
      api_key_id: keyRecord.id,
      retry_count: 0,
    });

    // Log usage
    await UsageEvent.create({
      user_id: keyRecord.user_id,
      api_key_id: keyRecord.id,
      service_type: 'sms',
      total_cost: cost,
      reference_id: smsLog.id,
    });

    return { id: smsLog.id, status: 'queued' };
  }

  async sendEmail(apiKey, toEmail, subject, message) {
    const keyRecord = await this.validateApiKey(apiKey);
    const cost = 0.01; // Example cost per Email

    const emailLog = await EmailLog.create({
      user_id: keyRecord.user_id,
      api_key_id: keyRecord.id,
      to_email: toEmail,
      subject,
      message,
      cost,
    });

    // Publish to queue
    await queuePublisher.publish(config.queues.email, {
      id: emailLog.id,
      to_email: toEmail,
      subject,
      message,
      cost,
      user_id: keyRecord.user_id,
      api_key_id: keyRecord.id,
      retry_count: 0,
    });

    // Log usage
    await UsageEvent.create({
      user_id: keyRecord.user_id,
      api_key_id: keyRecord.id,
      service_type: 'email',
      total_cost: cost,
      reference_id: emailLog.id,
    });

    return { id: emailLog.id, status: 'queued' };
  }
}

module.exports = new CommunicationService();