const requiredKeys = [
  'RABBITMQ_URL',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
];

require('dotenv').config();

const missingKeys = requiredKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  console.warn(`Missing environment variables: ${missingKeys.join(', ')}`);
}
