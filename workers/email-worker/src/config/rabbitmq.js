const {
  RABBITMQ_URL = 'amqp://user:password@rabbitmq:5672',
  RABBITMQ_EMAIL_QUEUE = 'email_queue',
} = process.env;

module.exports = {
  url: RABBITMQ_URL,
  queue: RABBITMQ_EMAIL_QUEUE,
  options: {
    heartbeat: 30,
  },
};
