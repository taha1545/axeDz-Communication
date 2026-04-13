# AxeDz Communication Service

A production-ready Communication Service (CPaaS) built with Node.js, Express, and PostgreSQL. Send SMS and Email messages at scale with reliable queue-based processing, comprehensive analytics, and enterprise-grade security.

## Features

- SMS sending with queue-based processing
- Email sending with HTML and plain text support
- API key authentication with rate limiting
- Usage analytics and cost tracking
- Queue-based architecture with RabbitMQ
- Retry logic (up to 3 attempts) for failed messages
- Comprehensive logging with Winston
- Docker support
- Database transactions for data integrity
- Request validation and security middleware

## Tech Stack

- Backend: Node.js, Express.js
- Database: PostgreSQL with Sequelize ORM
- Message Queue: RabbitMQ (AMQP)
- Email: Nodemailer
- SMS: Ooredoo API provider
- Authentication: API Key validation
- Logging: Winston
- Security: Helmet, CORS, XSS protection, rate limiting

## API Documentation

See API_DOCUMENTATION.md for detailed API endpoints and usage.