const axios = require('axios');
const db = require('../db/models');
const { SmsLog } = db;
const smsConfig = require('../config/sms');
const logger = require('../config/logger');

class SmsWorkerLogic {
  async sendSmsToProvider({ to_number, message }) {
    if (!smsConfig.apiKey || !smsConfig.apiUrl) {
      logger.warn('SMS provider config is missing; using stubbed provider for local processing');
      return true;
    }

    const payload = {
      to: to_number,
      from: smsConfig.fromNumber,
      text: message,
    };
    //
    const headers = {
      Authorization: `Bearer ${smsConfig.apiKey}`,
      'Content-Type': 'application/json',
    };
    //
    const response = await axios.post(smsConfig.apiUrl, payload, { headers });
    return response.status === 200 && response.data?.success;
  }

  async markAsSent(id) {
    return SmsLog.update(
      { status: 'sent', sent_at: new Date() },
      { where: { id } }
    );
  }

  async markAsFailed(id, retryCount) {
    return SmsLog.update(
      { status: 'failed', retry_count: retryCount },
      { where: { id } }
    );
  }

  async processSms(data) {
    const { id, to_number, message, retry_count = 0 } = data;
    const success = await this.sendSmsToProvider({ to_number, message });

    if (success) {
      await this.markAsSent(id);
      logger.info('SMS sent successfully', { id });
      return;
    }

    await this.markAsFailed(id, retry_count + 1);
    throw new Error('SMS sending failed');
  }

  shouldRetry(data) {
    return data.retry_count < 3;
  }
}

module.exports = new SmsWorkerLogic();