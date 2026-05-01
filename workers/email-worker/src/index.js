require('./config/env');
const EmailWorker = require('./worker');
const emailWorkerLogic = require('./logic/emailWorkerLogic');
const logger = require('./config/logger');

async function shutdown(worker, error) {
  if (error) {
    logger.error('Email worker shutting down due to error', error);
  }

  try {
    await worker.close();
    logger.info('Email worker stopped');
  } catch (closeError) {
    logger.error('Failed to close worker cleanly', closeError);
  } finally {
    process.exit(error ? 1 : 0);
  }
}

async function start() {
  const worker = new EmailWorker();

  process.once('SIGINT', () => shutdown(worker));
  process.once('SIGTERM', () => shutdown(worker));

  try {
    await emailWorkerLogic.ensureDatabase();
    await worker.start();
  } catch (error) {
    logger.error('Email worker failed to start', error);
    await shutdown(worker, error);
  }
}

start();
