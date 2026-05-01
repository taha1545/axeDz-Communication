const axios = require('axios');

class ApiKeyValidator {
    async validateApiKey(apiKey) {
        try {
            const response = await axios.post(
                `${process.env.AUTH_SERVICE_URL}/api-keys/validate`,
                { key: apiKey }
            );
            //
            const data = response.data;
            //
            if (data.success) {
                return {
                    id: data.apiKey.id,
                    user_id: data.apiKey.user_id,
                    key: data.apiKey.key,
                };
            }
            throw new Error('Invalid API key');
        } catch (error) {
            console.error(error.response?.data || error.message);
            throw new Error('API key validation failed');
        }
    }
}

module.exports = new ApiKeyValidator();
