const apiKeyValidator = require('./ApiKeyValidator');
const smsService = require('./SmsService');
const emailService = require('./EmailService');
const statsService = require('./StatsService');
const logger = require('../../config/logger');

class CommunicationService {

    async validateApiKey(apiKey) {
        return await apiKeyValidator.validateApiKey(apiKey);
    }

    async sendSms(apiKey, toNumber, message) {
        //   const keyRecord = await this.validateApiKey(apiKey);
        return await smsService.sendSms(apiKey, toNumber, message);
    }

    async sendEmail(apiKey, toEmail, subject, message, bodyType) {
        // const keyRecord = await this.validateApiKey(apiKey);
        return await emailService.sendEmail(apiKey, toEmail, subject, message, bodyType);
    }

    async getUsageEvents(apiKey, options) {
        // const keyRecord = await this.validateApiKey(apiKey);
        return await statsService.getUsageEvents(apiKey, options);
    }

    async getLastSms(apiKey) {
        // const keyRecord = await this.validateApiKey(apiKey);
        return await statsService.getLastSms(apiKey);
    }

    async getLastEmail(apiKey) {
        // const keyRecord = await this.validateApiKey(apiKey);
        return await statsService.getLastEmail(apiKey);
    }

    async getStats(apiKey) {
        // const keyRecord = await this.validateApiKey(apiKey);
        return await statsService.getStats(apiKey);
    }
}

module.exports = new CommunicationService();