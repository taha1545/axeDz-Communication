const logger = require('../config/logger');
const smsProvider = require('../services/smsProvider');
const db = require('../models');

const MAX_RETRY_COUNT = 3;

class SmsWorkerLogic {

  async ensureDatabase() {
    await db.sequelize.authenticate();
  }

  validatePayload(payload) {
    if (!payload || !payload.id || !payload.to_number || !payload.message) {
      throw new Error('SMS payload must include id, to_number, and message');
    }
    return {
      ...payload,
      retry_count: Number(payload.retry_count || 0),
    };
  }

  async updateStatus(id, status, retryCount = 0) {
    const updateValues = { status, retry_count: retryCount };
    if (status === 'sent') {
      updateValues.sent_at = new Date();
    }
    return db.SmsLog.update(updateValues, { where: { id } });
  }

  async processSms(rawPayload) {
    //
    const payload = this.validatePayload(rawPayload);
    const success = await smsProvider.send(payload);
    //
    if (success) {
      await this.updateStatus(payload.id, 'sent', payload.retry_count);
      logger.info('SMS sent successfully', { id: payload.id });
      return;
    }
    //
    const nextRetry = payload.retry_count + 1;
    await this.updateStatus(payload.id, 'failed', nextRetry);
    logger.warn('SMS send failed', { id: payload.id, retry_count: nextRetry });
    throw new Error('SMS provider returned failure');
  }

  shouldRetry(retryCount) {
    return retryCount < MAX_RETRY_COUNT;
  }
}

module.exports = new SmsWorkerLogic();
