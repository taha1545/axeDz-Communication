const db = require('../../db/models');
const { UsageEvent, SmsLog, EmailLog } = db;

class StatsService {
  async getUsageEvents(apiKeyRecord, options = {}) {
    const { limit = 10, offset = 0 } = options;

    const events = await UsageEvent.findAll({
      where: { api_key_id: apiKeyRecord.id },
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    const total = await UsageEvent.count({
      where: { api_key_id: apiKeyRecord.id },
    });

    return {
      events,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async getLastSms(apiKeyRecord) {
    const lastSms = await SmsLog.findOne({
      where: { api_key_id: apiKeyRecord.id },
      order: [['created_at', 'DESC']],
    });

    return lastSms;
  }

  async getLastEmail(apiKeyRecord) {
    const lastEmail = await EmailLog.findOne({
      where: { api_key_id: apiKeyRecord.id },
      order: [['created_at', 'DESC']],
    });

    return lastEmail;
  }

  async getStats(apiKeyRecord) {
    const [smsStats, emailStats, usageStats] = await Promise.all([
      this.getSmsStats(apiKeyRecord.id),
      this.getEmailStats(apiKeyRecord.id),
      this.getUsageStats(apiKeyRecord.id),
    ]);

    return {
      sms: smsStats,
      email: emailStats,
      usage: usageStats,
    };
  }

  async getSmsStats(apiKeyId) {
    const [total, sent, failed, pending] = await Promise.all([
      SmsLog.count({ where: { api_key_id: apiKeyId } }),
      SmsLog.count({ where: { api_key_id: apiKeyId, status: 'sent' } }),
      SmsLog.count({ where: { api_key_id: apiKeyId, status: 'failed' } }),
      SmsLog.count({ where: { api_key_id: apiKeyId, status: 'queued' } }),
    ]);

    return { total, sent, failed, pending };
  }

  async getEmailStats(apiKeyId) {
    const [total, sent, failed, pending] = await Promise.all([
      EmailLog.count({ where: { api_key_id: apiKeyId } }),
      EmailLog.count({ where: { api_key_id: apiKeyId, status: 'sent' } }),
      EmailLog.count({ where: { api_key_id: apiKeyId, status: 'failed' } }),
      EmailLog.count({ where: { api_key_id: apiKeyId, status: 'queued' } }),
    ]);

    return { total, sent, failed, pending };
  }

  async getUsageStats(apiKeyId) {
    const usage = await UsageEvent.findAll({
      where: { api_key_id: apiKeyId },
      attributes: [
        'service_type',
        [db.sequelize.fn('SUM', db.sequelize.col('total_cost')), 'total_cost'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
      ],
      group: ['service_type'],
    });

    const stats = { sms: { count: 0, cost: 0 }, email: { count: 0, cost: 0 } };

    usage.forEach(item => {
      const service = item.service_type;
      stats[service] = {
        count: parseInt(item.dataValues.count),
        cost: parseFloat(item.dataValues.total_cost),
      };
    });

    return stats;
  }
}

module.exports = new StatsService();