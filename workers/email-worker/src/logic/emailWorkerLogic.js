const logger = require('../config/logger');
const emailProvider = require('../services/emailProvider');
const db = require('../models');

const MAX_RETRY_COUNT = 3;

class EmailWorkerLogic {

  async ensureDatabase() {
    await db.sequelize.authenticate();
  }

  validatePayload(payload) {
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
    return db.EmailLog.update(updateValues, { where: { id } });
  }

  async processEmail(rawPayload) {
    //
    const payload = this.validatePayload(rawPayload);
    const success = await emailProvider.send(payload);
    //
    if (success) {
      await this.updateStatus(payload.id, 'sent', payload.retry_count);
      logger.info('Email sent successfully', { id: payload.id });
      return;
    }
    //
    const nextRetry = payload.retry_count + 1;
    await this.updateStatus(payload.id, 'failed', nextRetry);
    logger.warn('Email send failed', { id: payload.id, retry_count: nextRetry });
    throw new Error('Email provider returned failure');
  }

  shouldRetry(retryCount) {
    return retryCount < MAX_RETRY_COUNT;
  }
}

module.exports = new EmailWorkerLogic();
