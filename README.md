# AxeDz Communication Service

A production-ready Communication Service for CPaaS platform built with Node.js, Express, PostgreSQL, and RabbitMQ.

## Features

- **API Key Authentication**: Secure API access with API key validation
- **SMS Sending**: Queue SMS messages for asynchronous processing
- **Email Sending**: Queue email messages for asynchronous processing
- **Rate Limiting**: Per API key rate limiting
- **Retry Logic**: Automatic retry for failed messages (max 3 retries)
- **Logging**: Winston-based logging
- **Docker Support**: Full containerization with Docker Compose
- **Clean Architecture**: Separation of controllers, services, and workers

## Tech Stack

- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- RabbitMQ (for async processing)
- Docker + Docker Compose
- Winston (logging)
- Nodemailer (email sending)

## Project Structure

```
├── app.js                          # Main application entry
├── Dockerfile                      # Docker image definition
├── docker-compose.yml              # Multi-service setup
├── package.json                    # Dependencies and scripts
├── .env.example                    # Environment variables template
├── config/                         # Configuration files
│   ├── db.js                       # Database configuration
│   ├── rabbitmq.js                 # RabbitMQ configuration
│   └── logger.js                   # Logging configuration
├── db/                             # Database related files
│   ├── migrations/                 # Sequelize migrations
│   └── models/                     # Sequelize models
├── queues/                         # RabbitMQ publishers
│   └── publisher.js                # Queue publisher class
├── workers/                        # Background workers
│   ├── sms.worker.js               # SMS processing worker
│   └── email.worker.js             # Email processing worker
├── Controllers/                    # Route controllers
│   └── CommunicationController.js  # Communication endpoints
├── app/                            # Application logic
│   ├── Services/                   # Business logic services
│   │   └── CommunicationService.js # Communication service
│   ├── Middlewares/                # Express middlewares
│   │   ├── ApiKey.js               # API key validation
│   │   └── Handle.js               # Error handling
│   ├── Validators/                 # Input validation
│   │   ├── smsValidator.js         # SMS validation rules
│   │   └── emailValidator.js       # Email validation rules
│   └── Error/                      # Custom error classes
├── Routes/                         # Route definitions
│   └── index.js                    # Main router
└── logs/                           # Application logs
```

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd communication-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   npm run migrate
   ```

5. **Start Services**
   ```bash
   # Using Docker Compose (recommended)
   docker-compose up --build

   # Or run individually
   npm start              # Start API server
   npm run start:sms-worker    # Start SMS worker
   npm run start:email-worker  # Start Email worker
   ```

## API Endpoints

### Send SMS
```http
POST /api/sms/send
Headers: x-api-key: your-api-key
Content-Type: application/json

{
  "to_number": "+1234567890",
  "message": "Hello World!"
}
```

### Send Email
```http
POST /api/email/send
Headers: x-api-key: your-api-key
Content-Type: application/json

{
  "to_email": "recipient@example.com",
  "subject": "Test Email",
  "message": "Hello from AxeDz!"
}
```

## Database Schema

- **api_keys**: API key management
- **usage_events**: Billing and usage tracking
- **sms_logs**: SMS sending logs
- **email_logs**: Email sending logs

## Workers

- **SMS Worker**: Processes SMS queue, calls Ooredoo API
- **Email Worker**: Processes email queue, sends via SMTP

## Development

```bash
npm run start:dev     # Development server with nodemon
npm run migrate       # Run database migrations
npm run migrate:undo  # Rollback last migration
```

## Production Deployment

1. Build and run with Docker Compose
2. Configure environment variables
3. Set up reverse proxy (nginx)
4. Monitor logs and queues

## License

ISC