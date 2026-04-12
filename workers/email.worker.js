const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const config = require('../config/rabbitmq');
const logger = require('../config/logger');
const db = require('../db/models');
const { EmailLog } = db;

class EmailWorker {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
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
                if (msg) {
                    try {
                        const data = JSON.parse(msg.content.toString());
                        await this.processEmail(data);
                        this.channel.ack(msg);
                    } catch (error) {
                        logger.error('Error processing Email message', error);
                        const data = JSON.parse(msg.content.toString());
                        if (data.retry_count < 3) {
                            data.retry_count += 1;
                            await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
                        } else {
                            this.channel.ack(msg);
                            logger.error('Max retries reached for Email', data);
                        }
                    }
                }
            });
        } catch (error) {
            logger.error('Error starting Email Worker', error);
        }
    }

    async processEmail(data) {
        const { id, to_email, subject, message } = data;

        try {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: to_email,
                subject: subject,
                text: message,
            };

            await this.transporter.sendMail(mailOptions);

            await EmailLog.update(
                { status: 'sent', sent_at: new Date() },
                { where: { id } }
            );
            logger.info('Email sent successfully', { id });
        } catch (error) {
            await EmailLog.update(
                { status: 'failed', retry_count: data.retry_count + 1 },
                { where: { id } }
            );
            throw error;
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

// Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('Shutting down Email Worker...');
    await worker.close();
    process.exit(0);
});

const worker = new EmailWorker();
worker.start().catch(console.error);