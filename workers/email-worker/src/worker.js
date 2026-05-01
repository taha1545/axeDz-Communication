const amqp = require('amqplib');
const config = require('./config/rabbitmq');
const logger = require('./config/logger');
const emailWorkerLogic = require('./logic/emailWorkerLogic');

class EmailWorker {

  constructor() {
    this.connection = null;
    this.channel = null;
    this.queue = config.queue;
  }

  async connect() {
    this.connection = await amqp.connect(config.url, config.options);
    this.channel = await this.connection.createChannel();
    await this.channel.prefetch(1);
    //
    logger.info('Connected to RabbitMQ', { queue: this.queue });
  }

  async start() {
    await this.connect();
    await this.channel.assertQueue(this.queue, { durable: true });
    logger.info('Email worker waiting for messages', { queue: this.queue });
    await this.channel.consume(this.queue, (msg) => this.handleMessage(msg), { noAck: false });
  }

  async handleMessage(msg) {
    if (!msg) return;
    let payload;
    try {
      payload = JSON.parse(msg.content.toString());
    } catch (error) {
      logger.error('Invalid message payload', { error: error.message });
      this.channel.ack(msg);
      return;
    }
    //
    try {
      await emailWorkerLogic.processEmail(payload);
      this.channel.ack(msg);
      //
    } catch (error) {
      const retryCount = Number(payload.retry_count || 0);
      const shouldRetry = emailWorkerLogic.shouldRetry(retryCount);
      if (shouldRetry) {
        payload.retry_count = retryCount + 1;
        await this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(payload)), {
          persistent: true,
        });
        logger.info('Email message requeued', { id: payload.id, retry_count: payload.retry_count });
      } else {
        logger.error('Email message reached max retry count', { id: payload.id });
      }
      this.channel.ack(msg);
    }
  }

  async close() {
    try {
      if (this.channel) await this.channel.close();
    } catch (error) {
      logger.warn('Failed to close RabbitMQ channel', { error: error.message });
    }

    try {
      if (this.connection) await this.connection.close();
    } catch (error) {
      logger.warn('Failed to close RabbitMQ connection', { error: error.message });
    }
  }
}

module.exports = EmailWorker;
