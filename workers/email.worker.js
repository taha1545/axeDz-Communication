const amqp = require('amqplib');
const config = require('../config/rabbitmq');
const logger = require('../config/logger');
const emailWorkerLogic = require('../worker-logic/emailWorkerLogic');

class EmailWorker {
  //
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(config.url);
      this.channel = await this.connection.createChannel();
      await this.channel.prefetch(1);
      logger.info('Email Worker connected to RabbitMQ');
    } catch (error) {
      logger.error('Email Worker failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async start() {
    try {
      if (!this.channel) await this.connect();
      const queue = config.queues.email;
      await this.channel.assertQueue(queue, { durable: true });

      logger.info(`Email Worker waiting for messages in queue: ${queue}`);

      this.channel.consume(queue, async (msg) => {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString());

        try {
          await emailWorkerLogic.processEmail(data);
          this.channel.ack(msg);
        } catch (error) {
          logger.error('Error processing Email message', error);
          if (emailWorkerLogic.shouldRetry(data)) {
            data.retry_count = (data.retry_count || 0) + 1;
            await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
          } else {
            this.channel.ack(msg);
            logger.error('Max retries reached for Email', data);
          }
        }
      });
    } catch (error) {
      logger.error('Error starting Email Worker', error);
    }
  }

  async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      logger.info('Email Worker connection closed');
    } catch (error) {
      logger.error('Error closing Email Worker connection', error);
    }
  }
}

process.on('SIGINT', async () => {
  logger.info('Shutting down Email Worker...');
  await worker.close();
  process.exit(0);
});

const worker = new EmailWorker();
worker.start().catch(console.error);