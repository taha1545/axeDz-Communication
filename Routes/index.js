require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ErrorHandler = require('../app/Middlewares/Handle');
const validateRequest = require('../app/Middlewares/validate');
const checkApiKey = require('../app/Middlewares/ApiKey');
const communicationController = require('../Controllers/CommunicationController');
const { sendSmsValidator } = require('../app/Validators/smsValidator');
const { sendEmailValidator } = require('../app/Validators/emailValidator');
const { getUsageEventsValidator } = require('../app/Validators/usageValidator');

const app = express();

//
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req) => req.headers['x-api-key'] || req.ip,
    message: 'Too many requests from this API key, please try again later.',
});
app.use('/api/', limiter);
// 

//
app.get('/', (req, res) => { res.json({ message: 'Welcome to AxeDz Communication API' }); });

// Communication routes
app.post('/api/sms/send', sendSmsValidator, validateRequest, communicationController.sendSms);
app.post('/api/email/send', sendEmailValidator, validateRequest, communicationController.sendEmail);

// Analytics routes
app.get('/api/usage-events', getUsageEventsValidator, validateRequest, communicationController.getUsageEvents);
app.get('/api/sms/last', communicationController.getLastSms);
app.get('/api/email/last', communicationController.getLastEmail);
app.get('/api/stats', communicationController.getStats);



// 404 handler
app.use((req, res) => { res.status(404).json({ message: 'Endpoint not found', }); });
// Error handler
app.use(ErrorHandler);

module.exports = app;