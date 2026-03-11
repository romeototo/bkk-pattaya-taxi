# Notification System Architecture

## Overview

The BKK Pattaya Private Taxi booking system implements a robust, multi-channel notification system that ensures booking information reaches all stakeholders through their preferred communication channels.

## System Components

### 1. Notification Service (`server/integrations/notificationService.ts`)

The central orchestrator that coordinates all notification channels.

**Key Features**:
- Sends notifications to all channels simultaneously
- Handles failures gracefully (booking succeeds even if notifications fail)
- Provides detailed logging for debugging
- Returns status for each channel

**Function**: `notifyNewBooking(booking, adminEmail, lineUserId?)`

```typescript
// Returns object with success status for each channel
{
  googleSheets: boolean,
  telegram: boolean,
  line: boolean,
  confirmationEmail: boolean,
  adminEmail: boolean
}
```

### 2. Integration Modules

#### Google Sheets Integration (`server/integrations/googleSheets.ts`)

**Purpose**: Append booking data to a Google Sheet for record-keeping and analysis

**Features**:
- Authenticates using Service Account credentials
- Appends formatted booking rows to the sheet
- Includes all booking details and metadata
- Handles authentication errors gracefully

**Data Stored**:
```
ID | Full Name | Phone | Email | Pickup | Dropoff | Date | Time | 
Passengers | Luggage | Contact Method | Notes | Status | Created At
```

#### Telegram Integration (`server/integrations/telegram.ts`)

**Purpose**: Send real-time booking notifications to admin via Telegram

**Features**:
- Sends formatted messages to admin chat
- Includes all booking details
- Handles bot token validation
- Provides formatted output for easy reading

**Message Format**:
```
🚕 NEW BOOKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Passenger: John Doe
📱 Phone: +66971729666
📧 Email: john@example.com
📍 From: Bangkok Airport
📍 To: Pattaya Hotel
📅 Date: 2026-03-15
⏰ Time: 14:00
👥 Passengers: 2
🧳 Luggage: 2
💬 Contact: WhatsApp
📝 Notes: Please arrive 30 minutes early
```

#### LINE Integration (`server/integrations/line.ts`)

**Purpose**: Send booking notifications via LINE Messaging API

**Features**:
- Sends formatted messages to LINE users
- Supports both text and structured messages
- Handles user ID validation
- Integrates with LINE's official account

**Message Format**:
```
🚕 BKK Pattaya Taxi - New Booking

Passenger: John Doe
Phone: +66971729666
Route: Bangkok Airport → Pattaya Hotel
Date: 2026-03-15 at 14:00
Passengers: 2 | Luggage: 2
Contact: WhatsApp
```

#### Email Integration (`server/integrations/email.ts`)

**Purpose**: Send confirmation and admin notification emails

**Features**:
- Sends customer confirmation emails
- Sends admin notification emails
- Uses SMTP for reliability
- Includes HTML and plain text versions
- Handles email validation

**Email Types**:

1. **Customer Confirmation Email**
   - Sent to: Customer email
   - Contains: Booking details, confirmation number, next steps
   - Purpose: Confirms booking and provides reference information

2. **Admin Notification Email**
   - Sent to: Admin email
   - Contains: Full booking details, customer contact info
   - Purpose: Alerts admin to new bookings for processing

## Data Flow

### Booking Submission Flow

```
1. User submits booking form
   ↓
2. Frontend validates input
   ↓
3. tRPC API receives request (server/routers.ts)
   ↓
4. Booking is saved to database
   ↓
5. notifyNewBooking() is called
   ↓
6. Notification Service orchestrates all channels:
   ├─ Google Sheets API (append row)
   ├─ Telegram Bot API (send message)
   ├─ LINE Messaging API (send message)
   ├─ SMTP (send confirmation email)
   └─ SMTP (send admin email)
   ↓
7. Return success status to frontend
   ↓
8. User sees confirmation message
```

### Error Handling

The system implements a **fail-safe** approach:

```
Booking saved to database ✓
  ├─ Google Sheets fails → Log error, continue
  ├─ Telegram fails → Log error, continue
  ├─ LINE fails → Log error, continue
  ├─ Email fails → Log error, continue
  └─ Return success (booking is saved)
```

**Rationale**: The booking is the most critical data. If any notification channel fails, the booking is still recorded in the database and can be manually processed by the admin.

## Configuration

### Environment Variables

```bash
# Google Sheets
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j

# Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklmnoPQRstuvWXYZ
TELEGRAM_CHAT_ID=987654321

# LINE
LINE_CHANNEL_ACCESS_TOKEN=630f58e96abf9c63c689a2321f3cc27a

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@example.com
SMTP_PASSWORD=app-password
ADMIN_EMAIL=admin@example.com
```

## Testing

### Unit Tests

Located in `server/integrations/notificationService.test.ts`

**Test Coverage**:
- ✓ Sends notifications to all channels
- ✓ Handles missing LINE user ID gracefully
- ✓ Returns success even if individual channels fail
- ✓ Includes all booking details in notifications

**Run Tests**:
```bash
pnpm test
```

### Manual Testing

1. Fill out booking form with test data
2. Verify booking appears in:
   - Database (via Admin Dashboard)
   - Google Sheets
   - Telegram chat
   - LINE chat (if user is a friend of bot)
   - Email inbox (confirmation and admin emails)

## Monitoring & Logging

### Log Locations

- **Server Logs**: `.manus-logs/devserver.log`
- **Browser Console**: `.manus-logs/browserConsole.log`
- **Network Requests**: `.manus-logs/networkRequests.log`

### Log Format

```
[2026-03-12T10:30:45.123Z] [NotificationService] Booking notifications sent: {
  googleSheets: true,
  telegram: true,
  line: true,
  confirmationEmail: true,
  adminEmail: true
}
```

### Debugging

To debug notification issues:

1. Check server logs for errors
2. Verify environment variables are set correctly
3. Test each channel independently
4. Check API rate limits (especially for Telegram and LINE)
5. Verify credentials have proper permissions

## Scalability Considerations

### Current Architecture

- **Synchronous**: All notifications sent in sequence
- **Blocking**: Booking response waits for all notifications
- **Suitable for**: < 1000 bookings/day

### Future Improvements

For higher volume, consider:

1. **Asynchronous Queue**
   - Use Redis/RabbitMQ for message queue
   - Send notifications asynchronously
   - Retry failed notifications automatically

2. **Batch Processing**
   - Batch Google Sheets updates
   - Reduce API calls

3. **Rate Limiting**
   - Implement per-channel rate limits
   - Handle API throttling gracefully

4. **Webhook Integration**
   - Receive delivery confirmations
   - Track notification status

## Security Best Practices

### Credential Management

- ✓ All credentials stored in environment variables
- ✓ Never commit credentials to version control
- ✓ Use service accounts (not personal credentials)
- ✓ Rotate credentials regularly

### Data Protection

- ✓ HTTPS for all API calls
- ✓ Validate all input data
- ✓ Sanitize email content
- ✓ Use OAuth where available

### Access Control

- ✓ Service accounts have minimal required permissions
- ✓ Google Sheets shared with service account only
- ✓ Telegram bot token kept secure
- ✓ LINE channel token kept secure

## Troubleshooting Guide

### Google Sheets Not Receiving Data

**Symptoms**: Bookings appear in database but not in Google Sheets

**Causes**:
- Service account doesn't have access to sheet
- Sheet ID is incorrect
- Credentials JSON is malformed
- Sheet is full (unlikely but possible)

**Solutions**:
1. Verify service account email has "Editor" access
2. Copy Sheet ID directly from URL
3. Validate JSON syntax
4. Check server logs for specific errors

### Telegram Not Receiving Messages

**Symptoms**: Bookings saved but no Telegram notification

**Causes**:
- Bot token is invalid
- Chat ID is incorrect
- Bot is not active
- Rate limit exceeded

**Solutions**:
1. Verify bot token with `curl https://api.telegram.org/bot{TOKEN}/getMe`
2. Verify chat ID is numeric
3. Send test message to bot
4. Check Telegram API rate limits

### LINE Not Receiving Messages

**Symptoms**: Bookings saved but no LINE notification

**Causes**:
- Channel access token is invalid
- User hasn't added bot as friend
- User ID format is incorrect

**Solutions**:
1. Verify channel access token
2. Ensure user has added bot
3. Check user ID format
4. Verify message format is valid

### Email Not Sending

**Symptoms**: Bookings saved but no confirmation emails

**Causes**:
- SMTP credentials are incorrect
- SMTP port is wrong
- Email provider blocks the connection
- Email address is invalid

**Solutions**:
1. Test SMTP connection: `telnet smtp.gmail.com 587`
2. Verify credentials
3. Check email provider's security settings
4. Verify recipient email is valid

## Performance Metrics

### Typical Response Times

- Database save: ~50ms
- Google Sheets API: ~200-500ms
- Telegram API: ~100-300ms
- LINE API: ~100-300ms
- Email (SMTP): ~500-2000ms
- **Total**: ~1-3 seconds

### Optimization Tips

- Use connection pooling for database
- Cache Google Sheets authentication
- Implement request timeouts
- Use CDN for static assets

## Future Enhancements

1. **SMS Notifications**
   - Add Twilio integration for SMS alerts

2. **WhatsApp Integration**
   - Send notifications via WhatsApp API

3. **Push Notifications**
   - Send mobile push notifications

4. **Notification Preferences**
   - Allow users to choose notification channels
   - Implement do-not-disturb schedules

5. **Analytics Dashboard**
   - Track notification delivery rates
   - Monitor channel performance
   - Identify failure patterns

---

Last Updated: March 2026
