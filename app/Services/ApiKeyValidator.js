const axios = require('axios');

class ApiKeyValidator {
    async validateApiKey(apiKey) {
        try {
            const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/verify-api-key`, {
                api_key: apiKey
            });

            if (response.data.valid) {
                return {
                    id: response.data.user_id,
                };
            } else {
                throw new Error('Invalid API key');
            }
        } catch (error) {
            throw new Error('API key validation failed');
        }
    }
}

module.exports = new ApiKeyValidator();