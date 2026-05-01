const {
  SMS_API_URL = '',
  SMS_API_KEY = '',
  SMS_FROM_NUMBER = 'AXEDZ',
} = process.env;

module.exports = {
  apiUrl: SMS_API_URL,
  apiKey: SMS_API_KEY,
  fromNumber: SMS_FROM_NUMBER,
};
