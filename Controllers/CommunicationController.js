const communicationService = require('../app/Services/CommunicationService');

class CommunicationController {
    async sendSms(req, res, next) {
        try {
            const { to_number, message } = req.body;
            const apiKey = req.headers['x-api-key'];

            const result = await communicationService.sendSms(apiKey, to_number, message);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async sendEmail(req, res, next) {
        try {
            const { to_email, subject, message } = req.body;
            const apiKey = req.headers['x-api-key'];

            const result = await communicationService.sendEmail(apiKey, to_email, subject, message);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommunicationController();