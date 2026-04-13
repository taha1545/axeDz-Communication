module.exports = {
  provider: process.env.SMS_PROVIDER || 'ooredoo',
  apiUrl: process.env.SMS_PROVIDER_URL || 'https://api.ooredoo.example.com/sms',
  apiKey: process.env.SMS_PROVIDER_KEY,
  fromNumber: process.env.SMS_FROM_NUMBER || process.env.SMS_SENDER || 'AxeDz',
  costPerSms: parseFloat(process.env.SMS_COST) || 0.05,
};