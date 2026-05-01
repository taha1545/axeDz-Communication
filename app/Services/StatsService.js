const db = require('../../db/models');
const { UsageEvent, SmsLog, EmailLog } = db;
const { fn, col, literal } = db.sequelize;

// 
const getUsageEvents = async (apiKeyId, { limit = 10, offset = 0 } = {}) => {
  //
  const { rows, count } = await UsageEvent.findAndCountAll({
    where: { api_key_id: apiKeyId },
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });
  // 
  return {
    events: rows,
    pagination: {
      total: count,
      limit,
      offset,
      hasMore: offset + limit < count,
    },
  };
};

// 
const getLastRecord = (Model, apiKeyId) => {
  return Model.findOne({
    where: { api_key_id: apiKeyId },
    order: [['created_at', 'DESC']],
  });
};

const getLastSms = (apiKeyId) => getLastRecord(SmsLog, apiKeyId);
const getLastEmail = (apiKeyId) => getLastRecord(EmailLog, apiKeyId);

// 
const getMessageStats = async (Model, apiKeyId) => {
  const result = await Model.findOne({
    where: { api_key_id: apiKeyId },
    attributes: [
      [fn('COUNT', col('id')), 'total'],
      [fn('SUM', literal(`CASE WHEN status = 'sent' THEN 1 ELSE 0 END`)), 'sent'],
      [fn('SUM', literal(`CASE WHEN status = 'failed' THEN 1 ELSE 0 END`)), 'failed'],
      [fn('SUM', literal(`CASE WHEN status = 'queued' THEN 1 ELSE 0 END`)), 'pending'],
    ],
    raw: true,
  });

  return {
    total: Number(result.total) || 0,
    sent: Number(result.sent) || 0,
    failed: Number(result.failed) || 0,
    pending: Number(result.pending) || 0,
  };
};

// 
const getUsageStats = async (apiKeyId) => {
  const results = await UsageEvent.findAll({
    where: { api_key_id: apiKeyId },
    attributes: [
      'service_type',
      [fn('COUNT', col('id')), 'count'],
      [fn('SUM', col('total_cost')), 'cost'],
    ],
    group: ['service_type'],
    raw: true,
  });

  const stats = {
    sms: { count: 0, cost: 0 },
    email: { count: 0, cost: 0 },
  };

  for (const row of results) {
    stats[row.service_type] = {
      count: Number(row.count),
      cost: Number(row.cost),
    };
  }

  return stats;
};

// 
const getStats = async (apiKeyId) => {
  const [sms, email, usage] = await Promise.all([
    getMessageStats(SmsLog, apiKeyId),
    getMessageStats(EmailLog, apiKeyId),
    getUsageStats(apiKeyId),
  ]);

  return { sms, email, usage };
};


module.exports = {
  getUsageEvents,
  getLastSms,
  getLastEmail,
  getStats,
};
