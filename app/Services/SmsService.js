const db = require('../../db/models');
const { SmsLog, UsageEvent } = db;
const queuePublisher = require('../../queues/publisher');
const config = require('../../config/rabbitmq');
const logger = require('../../config/logger');

class SmsService {
    async sendSms(apiKeyRecord, toNumber, message, provider = null) {
        const cost = parseFloat(process.env.SMS_COST) || 0.05;

        const result = await db.sequelize.transaction(async (transaction) => {
            // Create SMS log
            const smsLog = await SmsLog.create({
                api_key_id: apiKeyRecord.key,
                to_number: toNumber,
                message,
                provider,
            }, { transaction });

            // Log usage event
            await UsageEvent.create({
                api_key_id: apiKeyRecord.key,
                service_type: 'sms',
                unit_cost: cost,
                quantity: 1,
                total_cost: cost,
                reference_id: smsLog.id,
            }, { transaction });

            return smsLog;
        });

        // Publish to queue 
        try {
            await queuePublisher.publish(config.queues.sms, {
                id: result.id,
                to_number: toNumber,
                message,
                api_key_id: apiKeyRecord.key,
                retry_count: 0,
            });
        } catch (error) {
            logger.error('Failed to publish SMS to queue', error);
        }

        return { id: result.id, status: 'queued' };
    }
}

module.exports = new SmsService();