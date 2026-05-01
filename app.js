require('dotenv').config();

const db = require('./db/models');
const app = require('./Routes');
const queuePublisher = require('./queues/publisher');
const logger = require('./config/logger');

const PORT = process.env.APP_PORT || 3001;

async function startServer() {
  try {
    await db.sequelize.sync();
    logger.info('Database connected');
    // 
    await queuePublisher.connect();
    // 
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
    // 
    process.on('SIGINT', async () => {
      logger.info('Shutting down server...');
      server.close(async () => {
        await queuePublisher.close();
        await db.sequelize.close();
        logger.info('Server shut down gracefully');
        process.exit(0);
      });
    });

  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();