const {
  RABBITMQ_URL = 'amqp://user:password@rabbitmq:5672',
  RABBITMQ_SMS_QUEUE = 'sms_queue',
} = process.env;

module.exports = {
  url: RABBITMQ_URL,
  queue: RABBITMQ_SMS_QUEUE,
  options: {
    heartbeat: 30,
  },
};
