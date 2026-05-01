require('./config/env');
const SmsWorker = require('./worker');
const smsWorkerLogic = require('./logic/smsWorkerLogic');
const logger = require('./config/logger');

async function shutdown(worker, error) {
  if (error) {
    logger.error('SMS worker shutting down due to error', error);
  }

  try {
    await worker.close();
    logger.info('SMS worker stopped');
  } catch (closeError) {
    logger.error('Failed to close worker cleanly', closeError);
  } finally {
    process.exit(error ? 1 : 0);
  }
}

async function start() {
  const worker = new SmsWorker();

  process.once('SIGINT', () => shutdown(worker));
  process.once('SIGTERM', () => shutdown(worker));

  try {
    await smsWorkerLogic.ensureDatabase();
    await worker.start();
  } catch (error) {
    logger.error('SMS worker failed to start', error);
    await shutdown(worker, error);
  }
}

start();
