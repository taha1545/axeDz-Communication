require('dotenv').config();

module.exports = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost',
  queues: {
    sms: 'sms_queue',
    email: 'email_queue',
  },
  options: {
    heartbeat: 30,
  }
};
