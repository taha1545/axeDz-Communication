const apiKeyValidator = require('../Services/ApiKeyValidator');

const checkApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        //
        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: 'API key is required'
            });
        }
        //
        const keyRecord = await apiKeyValidator.validateApiKey(apiKey);
        req.apiKeyRecord = keyRecord;
        //
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid API key'
        });
    }
};

module.exports = checkApiKey;