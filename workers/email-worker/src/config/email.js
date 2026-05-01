require('dotenv').config();

module.exports = {
  from: process.env.EMAIL_FROM || 'no-reply@axedz.com',
  transport: {
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  },
};
