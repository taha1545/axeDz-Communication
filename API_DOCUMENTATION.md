# AxeDz Communication Service - API Documentation

## Quick Start

**Base URL:** `http://localhost:3001/api`

**Authentication:** All requests require `X-API-Key` header
```bash
-H "X-API-Key: your_api_key_here"
```

## Endpoints

### SMS

#### Send SMS
```http
POST /api/sms/send
```

**Request:**
```json
{
  "to_number": "+212612345678",
  "message": "Hello from AxeDz!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sms_123456",
    "status": "queued"
  }
}
```

#### Get Last SMS
```http
GET /api/sms/last
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sms_123456",
    "to_number": "+212612345678",
    "message": "Hello from AxeDz!",
    "status": "sent",
    "created_at": "2024-01-15T10:30:45.000Z",
    "sent_at": "2024-01-15T10:30:52.000Z"
  }
}
```

### Email

#### Send Email
```http
POST /api/email/send
```

**Request:**
```json
{
  "to_email": "user@example.com",
  "subject": "Welcome",
  "message": "Hello from AxeDz!",
  "body_type": "text"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "email_123456",
    "status": "queued"
  }
}
```

#### Get Last Email
```http
GET /api/email/last
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "email_123456",
    "to_email": "user@example.com",
    "subject": "Welcome",
    "body": "Hello from AxeDz!",
    "status": "sent",
    "created_at": "2024-01-15T11:15:30.000Z",
    "sent_at": "2024-01-15T11:15:38.000Z"
  }
}
```

### Analytics

#### Get Usage Events
```http
GET /api/usage-events?limit=10&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "id": "event_123",
        "service_type": "sms",
        "quantity": 1,
        "unit_cost": 0.05,
        "total_cost": 0.05,
        "created_at": "2024-01-15T10:30:45.000Z"
      }
    ],
    "count": 1,
    "limit": 10,
    "offset": 0
  }
}
```

#### Get Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_sms_sent": 156,
    "total_emails_sent": 89,
    "total_cost": 8.79,
    "sms_cost": 7.80,
    "email_cost": 0.89,
    "success_rate": 0.978
  }
}
```

## Request Validation

### SMS Send
- `to_number`: Required, valid phone number (international format)
- `message`: Required, 1-160 characters

### Email Send
- `to_email`: Required, valid email address
- `subject`: Required, 1-150 characters
- `message`: Required, 1-1000 characters
- `body_type`: Optional, "text" or "html" (default: "text")

### Usage Events
- `limit`: Optional, 1-100 (default: 10)
- `offset`: Optional, ≥ 0 (default: 0)

## Rate Limiting

- **100 requests per 15 minutes** per API key
- Applies to all endpoints
- Returns `429 Too Many Requests` when exceeded

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Errors

| Status Code | Message | Description |
|-------------|---------|-------------|
| 400 | "to_number is required" | Missing phone number |
| 400 | "Invalid phone number" | Invalid phone format |
| 400 | "Message must be between 1 and 160 characters" | SMS too long |
| 400 | "to_email is required" | Missing email address |
| 400 | "Invalid email address" | Invalid email format |
| 401 | "Invalid API key" | Wrong or missing API key |
| 429 | "Too many requests..." | Rate limit exceeded |

## Status Values

### Message Status
- `queued` - Message received, waiting to be sent
- `sent` - Successfully delivered
- `failed` - Delivery failed after all retries

### Service Types
- `sms` - SMS message
- `email` - Email message

## Cost Information

- **SMS**: $0.05 per message (configurable via `SMS_COST`)
- **Email**: $0.01 per message (configurable via `EMAIL_COST`)
- Costs are deducted upon successful delivery
- Track usage via `/api/usage-events` and `/api/stats`

## Examples

### Send SMS
```bash
curl -X POST http://localhost:3001/api/sms/send \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "to_number": "+212612345678",
    "message": "Your verification code is: 123456"
  }'
```

### Send HTML Email
```bash
curl -X POST http://localhost:3001/api/email/send \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "to_email": "user@example.com",
    "subject": "Welcome to AxeDz",
    "message": "<h1>Welcome!</h1><p>Thank you for joining us.</p>",
    "body_type": "html"
  }'
```

### Get Recent Usage
```bash
curl -X GET "http://localhost:3001/api/usage-events?limit=20" \
  -H "X-API-Key: your_key"
```

### Check Statistics
```bash
curl -X GET http://localhost:3001/api/stats \
  -H "X-API-Key: your_key"
```

## Notes

- All messages are processed asynchronously via queue
- Failed messages are automatically retried up to 3 times
- Use `/api/sms/last` and `/api/email/last` to check delivery status
- Monitor usage costs with `/api/stats`
- Rate limits apply per API key across all endpoints

**Endpoint:** `POST /api/email/send`

Send an email message to a specified recipient.

#### Request

**Headers:**
```http
X-API-Key: YOUR_API_KEY
Content-Type: application/json
```

**Body Parameters:**

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| `to_email` | String | ✅ Yes | Valid email | Recipient email address |
| `subject` | String | ✅ Yes | 1-150 characters | Email subject line |
| `message` | String | ✅ Yes | 1-1000 characters | Email body content |
| `body_type` | String | ❌ No | `text` or `html` | Content type (default: `text`) |

**Example Request (Plain Text):**
```bash
curl -X POST http://localhost:3001/api/email/send \
  -H "X-API-Key: axedz_key_abc123xyz" \
  -H "Content-Type: application/json" \
  -d '{
    "to_email": "user@example.com",
    "subject": "Welcome to AxeDz",
    "message": "Thank you for signing up!",
    "body_type": "text"
  }'
```

**Example Request (HTML):**
```bash
curl -X POST http://localhost:3001/api/email/send \
  -H "X-API-Key: axedz_key_abc123xyz" \
  -H "Content-Type: application/json" \
  -d '{
    "to_email": "user@example.com",
    "subject": "Welcome to AxeDz",
    "message": "<h1>Welcome!</h1><p>Thank you for signing up to our service.</p>",
    "body_type": "html"
  }'
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440111",
    "status": "queued"
  }
}
```

**Error Examples:**

Invalid Email Format:
```json
{
  "success": false,
  "message": "Invalid email address"
}
```
**Status Code:** `400 Bad Request`

Subject Missing:
```json
{
  "success": false,
  "message": "subject is required"
}
```
**Status Code:** `400 Bad Request`

Invalid Body Type:
```json
{
  "success": false,
  "message": "body_type must be either text or html"
}
```
**Status Code:** `400 Bad Request`

Message Exceeds Length:
```json
{
  "success": false,
  "message": "Message must not exceed 1000 characters"
}
```
**Status Code:** `400 Bad Request`

#### Cost Calculation

Email cost:
- Default cost: `$0.01` per email
- Configurable via `EMAIL_COST` environment variable
- Deducted from account balance upon successful delivery

---

### 2. Get Last Email

**Endpoint:** `GET /api/email/last`

Retrieve the most recently sent email message for your account.

#### Request

**Headers:**
```http
X-API-Key: YOUR_API_KEY
Content-Type: application/json
```

**Example Request:**
```bash
curl -X GET http://localhost:3001/api/email/last \
  -H "X-API-Key: axedz_key_abc123xyz"
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440111",
    "to_email": "user@example.com",
    "subject": "Welcome to AxeDz",
    "body": "Thank you for signing up!",
    "body_type": "text",
    "status": "sent",
    "retry_count": 0,
    "created_at": "2024-01-15T11:15:30.000Z",
    "sent_at": "2024-01-15T11:15:38.000Z"
  }
}
```

**No Data Response:**
```json
{
  "success": true,
  "data": null
}
```

---

## Analytics Endpoints

### 1. Get Usage Events

**Endpoint:** `GET /api/usage-events`

Retrieve paginated usage events (SMS and email activity) for billing and analytics.

#### Request

**Headers:**
```http
X-API-Key: YOUR_API_KEY
Content-Type: application/json
```

**Query Parameters:**

| Parameter | Type | Optional | Default | Constraints | Description |
|-----------|------|----------|---------|-------------|-------------|
| `limit` | Integer | ✅ | 10 | 1-100 | Number of records per page |
| `offset` | Integer | ✅ | 0 | ≥ 0 | Number of records to skip |

**Example Requests:**

Basic (Default Pagination):
```bash
curl -X GET http://localhost:3001/api/usage-events \
  -H "X-API-Key: axedz_key_abc123xyz"
```

With Custom Pagination:
```bash
curl -X GET "http://localhost:3001/api/usage-events?limit=50&offset=100" \
  -H "X-API-Key: axedz_key_abc123xyz"
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "id": "750e8400-e29b-41d4-a716-446655440222",
        "api_key_id": "api_key_uuid",
        "service_type": "sms",
        "quantity": 1,
        "unit_cost": 0.05,
        "total_cost": 0.05,
        "reference_id": "sms_log_id",
        "created_at": "2024-01-15T10:30:45.000Z"
      },
      {
        "id": "850e8400-e29b-41d4-a716-446655440333",
        "api_key_id": "api_key_uuid",
        "service_type": "email",
        "quantity": 1,
        "unit_cost": 0.01,
        "total_cost": 0.01,
        "reference_id": "email_log_id",
        "created_at": "2024-01-15T11:15:30.000Z"
      }
    ],
    "count": 2,
    "limit": 10,
    "offset": 0
  }
}
```

**Field Descriptions:**
- `rows`: Array of usage events
- `count`: Total number of events in this response
- `limit`: Items per page
- `offset`: Number of items skipped

**Invalid Limit Parameter:**
```json
{
  "success": false,
  "message": "Limit must be a number between 1 and 100"
}
```
**Status Code:** `400 Bad Request`

---

### 2. Get Statistics

**Endpoint:** `GET /api/stats`

Get aggregated statistics including total SMS, emails sent, and total costs.

#### Request

**Headers:**
```http
X-API-Key: YOUR_API_KEY
Content-Type: application/json
```

**Example Request:**
```bash
curl -X GET http://localhost:3001/api/stats \
  -H "X-API-Key: axedz_key_abc123xyz"
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_sms_sent": 156,
    "total_emails_sent": 89,
    "total_sms_failed": 3,
    "total_emails_failed": 1,
    "total_cost": 8.79,
    "sms_cost": 7.80,
    "email_cost": 0.89,
    "success_rate": 0.978
  }
}
```

**Field Descriptions:**
- `total_sms_sent`: Number of successfully sent SMS
- `total_emails_sent`: Number of successfully sent emails
- `total_sms_failed`: Number of failed SMS (after all retries)
- `total_emails_failed`: Number of failed emails (after all retries)
- `total_cost`: Total accumulated cost
- `sms_cost`: Total SMS-related costs
- `email_cost`: Total email-related costs
- `success_rate`: Percentage of successful deliveries (0-1)

---

## Error Codes

### HTTP Status Codes

| Code | Name | Description |
|------|------|-------------|
| 200 | OK | Request succeeded |
| 400 | Bad Request | Invalid parameters or format |
| 401 | Unauthorized | Missing or invalid API key |
| 404 | Not Found | Endpoint not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Structure

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

### Common Error Messages

| Message | Cause | Solution |
|---------|-------|----------|
| "API key is required" | Missing X-API-Key header | Add X-API-Key header to request |
| "Invalid API key" | Invalid or expired key | Verify API key is correct |
| "to_number is required" | Missing phone number | Add to_number field to body |
| "Invalid phone number" | Invalid format | Use international format (e.g., +212...) |
| "Message must be between 1 and 160 characters" | SMS too long | Reduce message length |
| "Invalid email address" | Email format incorrect | Verify email format (user@domain.com) |
| "Too many requests from this API key" | Rate limit exceeded | Wait 15 minutes before retrying |
| "Endpoint not found" | Wrong URL path | Verify endpoint path |

---

## Examples

### Complete SMS Workflow

1. **Send SMS:**
```bash
curl -X POST http://localhost:3001/api/sms/send \
  -H "X-API-Key: axedz_key_abc123xyz" \
  -H "Content-Type: application/json" \
  -d '{
    "to_number": "+212612345678",
    "message": "Your verification code is: 123456"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "msg_123456",
    "status": "queued"
  }
}
```

2. **Check Last SMS (immediately after):**
```bash
curl -X GET http://localhost:3001/api/sms/last \
  -H "X-API-Key: axedz_key_abc123xyz"
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "msg_123456",
    "to_number": "+212612345678",
    "message": "Your verification code is: 123456",
    "status": "queued",
    "retry_count": 0,
    "created_at": "2024-01-15T10:30:45.000Z",
    "sent_at": null
  }
}
```

(After ~5-10 seconds, worker processes the message)

3. **Check Last SMS (after processing):**
```bash
curl -X GET http://localhost:3001/api/sms/last \
  -H "X-API-Key: axedz_key_abc123xyz"
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "msg_123456",
    "to_number": "+212612345678",
    "message": "Your verification code is: 123456",
    "status": "sent",
    "retry_count": 0,
    "created_at": "2024-01-15T10:30:45.000Z",
    "sent_at": "2024-01-15T10:30:52.000Z"
  }
}
```

4. **Check Usage Events:**
```bash
curl -X GET http://localhost:3001/api/usage-events \
  -H "X-API-Key: axedz_key_abc123xyz"
```

Response:
```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "id": "event_123",
        "api_key_id": "key_uuid",
        "service_type": "sms",
        "quantity": 1,
        "unit_cost": 0.05,
        "total_cost": 0.05,
        "reference_id": "msg_123456",
        "created_at": "2024-01-15T10:30:45.000Z"
      }
    ],
    "count": 1,
    "limit": 10,
    "offset": 0
  }
}
```

5. **Check Statistics:**
```bash
curl -X GET http://localhost:3001/api/stats \
  -H "X-API-Key: axedz_key_abc123xyz"
```

Response:
```json
{
  "success": true,
  "data": {
    "total_sms_sent": 1,
    "total_emails_sent": 0,
    "total_sms_failed": 0,
    "total_emails_failed": 0,
    "total_cost": 0.05,
    "sms_cost": 0.05,
    "email_cost": 0,
    "success_rate": 1.0
  }
}
```

### Complete Email Workflow

1. **Send Email:**
```bash
curl -X POST http://localhost:3001/api/email/send \
  -H "X-API-Key: axedz_key_abc123xyz" \
  -H "Content-Type: application/json" \
  -d '{
    "to_email": "john@example.com",
    "subject": "Password Reset Request",
    "message": "<h2>Password Reset</h2><p>Click here to reset your password: <a href=\"https://example.com/reset\">Reset Link</a></p>",
    "body_type": "html"
  }'
```

2. **Retrieve Last Email:**
```bash
curl -X GET http://localhost:3001/api/email/last \
  -H "X-API-Key: axedz_key_abc123xyz"
```

---

## Best Practices

### API Key Management
- ✅ Store API keys securely (environment variables, secrets manager)
- ❌ Don't commit API keys to version control
- ✅ Rotate keys periodically
- ❌ Don't share API keys publicly

### Request Handling
- ✅ Implement exponential backoff for retries
- ✅ Handle 429 (rate limit) responses gracefully
- ✅ Log all API interactions for debugging
- ❌ Don't make synchronous polling for message status

### Message Content
- ✅ Validate message content before sending
- ✅ Use plain text for SMS (limited to 160 chars)
- ✅ Use HTML for rich email formatting
- ❌ Don't send sensitive data in plaintext SMS

### Error Handling
- ✅ Check `success` field in all responses
- ✅ Read error `message` for debugging
- ✅ Implement retry logic with backoff
- ✅ Monitor failed message rates

---

## Rate Limiting Guidelines

To optimize API usage and avoid rate limits:

**Recommended Approach:**
- Batch send operations when possible
- Implement queue on client side for large batches
- Space out requests across the 15-minute window
- Monitor usage with `/api/usage-events` endpoint

**Example: Sending 200 SMS**
```
- Max rate: 100 requests per 15 minutes
- 200 SMS = 2 API calls minimum
- Spread across 15+ minutes to avoid limits
```

---

## Support & Contact

For API issues or questions:
- 📧 Email: api-support@axedz.com
- 🐛 Issues: Create issue in repository
- 📚 Docs: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

**Last Updated:** January 2024  
**API Version:** 1.0.0  
**Status:** Production Ready ✅
