const axios = require('axios');
const logger = require('../config/logger');
const smsConfig = require('../config/sms');

class SmsProvider {
    async send({ to_number, message }) {
        //
        if (!smsConfig.apiUrl || !smsConfig.apiKey) {
            logger.warn('SMS provider is not configured; using stub response', {
                to_number,
            });
            return true;
        }
        //
        try {
            // const response = await axios.post(
            //     smsConfig.apiUrl,
            //     {
            //         to: to_number,
            //         from: smsConfig.fromNumber,
            //         text: message,
            //     },
            //     {
            //         headers: {
            //             Authorization: `Bearer ${smsConfig.apiKey}`,
            //             'Content-Type': 'application/json',
            //         },
            //     },
            // );
            // return response.status === 200 && response.data?.success;
            //
            return true;
        } catch (error) {
            logger.error('SMS provider request failed', {
                error: error.message,
                to_number,
            });
            return false;
        }
    }
}

module.exports = new SmsProvider();
