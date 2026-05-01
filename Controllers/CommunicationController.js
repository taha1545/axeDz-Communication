const communicationService = require('../app/Services/CommunicationService');

class CommunicationController {

    async sendSms(req, res, next) {
        try {
            const { to_number, message, provider } = req.body;
            const apiKey = req.headers['x-api-key'];

            const result = await communicationService.sendSms(apiKey, to_number, message, provider);

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async sendEmail(req, res, next) {
        try {
            const { to_email, subject, message, body_type } = req.body;
            const apiKey = req.headers['x-api-key'];

            const result = await communicationService.sendEmail(apiKey, to_email, subject, message, body_type);

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async getUsageEvents(req, res, next) {
        try {
            const apiKey = req.headers['x-api-key'];
            const { limit = 10, offset = 0 } = req.query;

            const result = await communicationService.getUsageEvents(apiKey, {
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async getLastSms(req, res, next) {
        try {
            const apiKey = req.headers['x-api-key'];

            const result = await communicationService.getLastSms(apiKey);

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async getLastEmail(req, res, next) {
        try {
            const apiKey = req.headers['x-api-key'];

            const result = await communicationService.getLastEmail(apiKey);

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async getStats(req, res, next) {
        try {
            const apiKey = req.headers['x-api-key'];

            const result = await communicationService.getStats(apiKey);

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommunicationController();
