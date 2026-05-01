const apiKeyValidator = require('./ApiKeyValidator');
const smsService = require('./SmsService');
const emailService = require('./EmailService');
const statsService = require('./StatsService');
const logger = require('../../config/logger');

class CommunicationService {

    async validateApiKey(apiKey) {
        return await apiKeyValidator.validateApiKey(apiKey);
    }

    async sendSms(apiKey, toNumber, message, provider = null) {
        const keyRecord = await this.validateApiKey(apiKey);
        return await smsService.sendSms(keyRecord, toNumber, message, provider);
    }

    async sendEmail(apiKey, toEmail, subject, message, bodyType) {
        const keyRecord = await this.validateApiKey(apiKey);
        return await emailService.sendEmail(keyRecord, toEmail, subject, message, bodyType);
    }

    async getUsageEvents(apiKey, options) {
        const keyRecord = await this.validateApiKey(apiKey);
        return await statsService.getUsageEvents(keyRecord.key, options);
    }

    async getLastSms(apiKey) {
        const keyRecord = await this.validateApiKey(apiKey);
        return await statsService.getLastSms(keyRecord.key);
    }

    async getLastEmail(apiKey) {
        const keyRecord = await this.validateApiKey(apiKey);
        return await statsService.getLastEmail(keyRecord.key);
    }

    async getStats(apiKey) {
        const keyRecord = await this.validateApiKey(apiKey);
        return await statsService.getStats(keyRecord.key);
    }
}

module.exports = new CommunicationService();