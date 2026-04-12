const amqp = require('amqplib');
const config = require('../config/rabbitmq');
const logger = require('../config/logger');
const db = require('../db/models');
const { SmsLog } = db;

class SmsWorker {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(config.url);
      this.channel = await this.connection.createChannel();
      await this.channel.prefetch(1); 
      logger.info('SMS Worker connected to RabbitMQ');
    } catch (error) {
      logger.error('SMS Worker failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async start() {
    try {
      if (!this.channel) await this.connect();
      const queue = config.queues.sms;
      await this.channel.assertQueue(queue, { durable: true });

      logger.info(`SMS Worker waiting for messages in queue: ${queue}`);

      this.channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
            await this.processSms(data);
            this.channel.ack(msg);
          } catch (error) {
            logger.error('Error processing SMS message', error);
            const data = JSON.parse(msg.content.toString());
            if (data.retry_count < 3) {
              data.retry_count += 1;
              await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
            } else {
              this.channel.ack(msg);
              logger.error('Max retries reached for SMS', data);
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error starting SMS Worker', error);
    }
  }

  async processSms(data) {
    const { id, to_number, message, cost, user_id, api_key_id } = data;

    // 
    logger.info('Sending SMS', { to_number, message });

    // 
    const success = Math.random() > 0.2; 

    if (success) {
      await SmsLog.update(
        { status: 'sent', sent_at: new Date() },
        { where: { id } }
      );
      logger.info('SMS sent successfully', { id });
    } else {
      await SmsLog.update(
        { status: 'failed', retry_count: data.retry_count + 1 },
        { where: { id } }
      );
      throw new Error('SMS sending failed');
    }
  }

  async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      logger.info('SMS Worker connection closed');
    } catch (error) {
      logger.error('Error closing SMS Worker connection', error);
    }
  }
}

// 
process.on('SIGINT', async () => {
  logger.info('Shutting down SMS Worker...');
  await worker.close();
  process.exit(0);
});

const worker = new SmsWorker();
worker.start().catch(console.error);