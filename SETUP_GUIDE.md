# BKK Pattaya Private Taxi - Setup Guide

## Overview

This guide provides step-by-step instructions for setting up the BKK Pattaya Private Taxi booking system with all notification channels (Google Sheets, Telegram, LINE, and Email).

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Google Sheets Integration](#google-sheets-integration)
3. [Telegram Bot Integration](#telegram-bot-integration)
4. [LINE Messaging API Integration](#line-messaging-api-integration)
5. [Email Notifications (SMTP)](#email-notifications-smtp)
6. [Testing the System](#testing-the-system)
7. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### Prerequisites

- Node.js 18+ and pnpm installed
- MySQL/TiDB database running
- Access to Google Cloud Console, Telegram, LINE Developers, and email provider

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bkk-pattaya-taxi

# Install dependencies
pnpm install

# Copy environment template and fill in real values
copy .env.example .env

# Set up the database tables
pnpm db:push

# Create the first admin account
pnpm admin:create -- --username admin --email owner@example.com --password "change-this-password"

# Start the development server
pnpm dev
```

The application will be available at `http://localhost:3000`

Booking form submissions are sent to the backend first. The backend sends lead details to Telegram using `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. A static GitHub Pages deployment alone cannot send Telegram messages because it does not run the server.

Decision: keep GitHub Pages for the static marketing page and run the Node backend separately. In production, set `VITE_TRPC_URL` during the frontend build to the public backend endpoint, for example `https://your-backend.example.com/api/trpc`.

---

## Google Sheets Integration

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name: `BKK Pattaya Taxi`
4. Click "Create"

### Step 2: Enable Google Sheets API

1. In the Google Cloud Console, search for "Google Sheets API"
2. Click on it and press "Enable"
3. Search for "Google Drive API" and enable it as well

### Step 3: Create a Service Account

1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "Service Account"
3. Fill in the details:
   - Service account name: `bkk-pattaya-taxi-bot`
   - Click "Create and Continue"
4. Grant the following roles:
   - Editor (for accessing Google Sheets)
5. Click "Continue" and then "Done"

### Step 4: Create and Download JSON Key

1. In the Service Accounts list, click on the created service account
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create" - the JSON file will download automatically
6. Save this file securely

### Step 5: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named `BKK Pattaya Taxi Bookings`
3. Add headers in the first row:
   ```
   ID | Full Name | Phone | Email | Pickup Location | Dropoff Location | Travel Date | Travel Time | Passengers | Luggage | Contact Method | Notes | Status | Created At
   ```
4. Note the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### Step 6: Share the Sheet with Service Account

1. Open the Google Sheet
2. Click "Share"
3. Copy the service account email from the JSON file (looks like: `xxx@xxx.iam.gserviceaccount.com`)
4. Paste it in the share dialog and grant "Editor" access
5. Click "Share"

### Step 7: Configure Environment Variables

In the Manus Management UI (Settings → Secrets):

- **GOOGLE_SHEETS_CREDENTIALS**: Paste the entire JSON content from the downloaded key file
- **GOOGLE_SHEETS_ID**: Paste your Google Sheet ID

---

## Telegram Bot Integration

### Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/start` to begin
3. Send `/newbot`
4. Follow the prompts:
   - Choose a name: `BKK Pattaya Taxi Bot`
   - Choose a username: `bkk_pattaya_taxi_bot` (must be unique)
5. BotFather will provide a token like: `123456789:ABCdefGHIjklmnoPQRstuvWXYZ`
6. Save this token

### Step 2: Get Your Chat ID

1. Open Telegram and search for your bot (using the username from Step 1)
2. Click "Start"
3. Go to this URL in your browser: `https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates`
   - Replace `{YOUR_BOT_TOKEN}` with the token from Step 1
4. Look for the `"id"` field in the response - this is your Chat ID
5. Save this ID

### Step 3: Configure Environment Variables

In the Manus Management UI (Settings → Secrets):

- **TELEGRAM_BOT_TOKEN**: Paste your bot token
- **TELEGRAM_CHAT_ID**: Paste your chat ID

### Testing Telegram

1. Start the backend with `pnpm dev`
2. Submit the booking form on the homepage
3. Confirm the booking details arrive in the configured Telegram chat

The form still opens WhatsApp as a customer-facing copy/fallback, but Telegram is sent by the backend.

---

## Admin Account Setup

Admin login uses hashed credentials stored in the `adminCredentials` table. There is no built-in default password.

Create the first admin after `pnpm db:push`:

```bash
pnpm admin:create -- --username admin --email owner@example.com --password "use-a-strong-password"
```

Required environment variables:

- **DATABASE_URL**: MySQL/TiDB connection string
- **ADMIN_SESSION_SECRET**: Long random string used to sign admin sessions

For production, set `ADMIN_SESSION_SECRET` before starting the server. If it is missing in production, admin session creation fails intentionally.

---

## LINE Messaging API Integration

### Step 1: Create a LINE Official Account

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Sign in with your LINE account (create one if needed)
3. Click "Create a new provider" if you don't have one
4. Enter provider name: `BKK Pattaya Taxi`

### Step 2: Create a Messaging API Channel

1. Click "Create a new channel"
2. Choose "Messaging API"
3. Fill in the channel details:
   - Channel name: `BKK Pattaya Taxi Bot`
   - Channel description: `Booking notifications for BKK Pattaya Taxi`
   - Category: `Other`
   - Subcategory: `Other`
4. Accept the terms and click "Create"

### Step 3: Get the Channel Access Token

1. In the channel settings, go to the "Messaging API" tab
2. Scroll down to find "Channel access token"
3. Click "Issue" if not already generated
4. Copy the token (looks like: `630f58e96abf9c63c689a2321f3cc27a`)

### Step 4: Configure Environment Variables

In the Manus Management UI (Settings → Secrets):

- **LINE_CHANNEL_ACCESS_TOKEN**: Paste your channel access token

### Step 5: Link Your LINE Bot to the Website

1. In the channel settings, find the "QR code" section
2. Users can scan this QR code to add your bot as a friend
3. Generate a QR code image for your website's contact section

---

## Email Notifications (SMTP)

### Option A: Using Gmail

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Find "App passwords" and generate a new one for "Mail"
4. Copy the generated password

### Option B: Using SendGrid

1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Create an API key in Settings → API Keys
3. Copy the API key

### Option C: Using Other SMTP Providers

Contact your email provider for SMTP credentials.

### Configure Environment Variables

In the Manus Management UI (Settings → Secrets):

- **SMTP_HOST**: Your SMTP server (e.g., `smtp.gmail.com`)
- **SMTP_PORT**: SMTP port (e.g., `587` for TLS)
- **SMTP_USER**: Your email address
- **SMTP_PASSWORD**: Your app password or API key
- **ADMIN_EMAIL**: Email address to receive admin notifications

---

## Testing the System

### Manual Testing

1. Navigate to the booking form on the website
2. Fill in all fields with test data
3. Submit the form
4. Verify that:
   - Booking is saved in the database
   - New row appears in Google Sheets
   - Telegram notification is received
   - LINE notification is received (if user is a friend of the bot)
   - Confirmation email is sent to the customer
   - Admin notification email is sent

### Automated Testing

```bash
# Run the test suite
pnpm test

# Run tests in watch mode
pnpm test:watch
```

All notification service tests should pass:

```
✓ server/integrations/notificationService.test.ts (4 tests)
✓ server/booking.test.ts (7 tests)
✓ server/admin.test.ts (7 tests)
✓ server/notifications.test.ts (7 tests)
```

---

## Troubleshooting

### Google Sheets Not Receiving Bookings

**Problem**: Bookings are not appearing in Google Sheets

**Solutions**:
1. Verify the service account email has "Editor" access to the sheet
2. Check that `GOOGLE_SHEETS_ID` is correct (copy from URL)
3. Ensure `GOOGLE_SHEETS_CREDENTIALS` JSON is valid
4. Check server logs for error messages: `tail -f .manus-logs/devserver.log`

### Telegram Notifications Not Working

**Problem**: Telegram messages are not being received

**Solutions**:
1. Verify the bot token is correct
2. Verify the chat ID is correct (should be a number)
3. Send a test message to the bot to ensure it's active
4. Check server logs for error messages

### LINE Notifications Not Working

**Problem**: LINE messages are not being received

**Solutions**:
1. Verify the channel access token is correct
2. Ensure the user has added your bot as a friend
3. Check that the user ID is being captured correctly
4. Verify the channel is in "Messaging API" mode (not "Bot Designer")

### Email Notifications Not Sending

**Problem**: Confirmation and admin emails are not being sent

**Solutions**:
1. Verify SMTP credentials are correct
2. Check that the SMTP port is correct (usually 587 for TLS or 465 for SSL)
3. For Gmail, ensure you're using an "App password" not your regular password
4. Check that `ADMIN_EMAIL` is a valid email address
5. Check server logs for SMTP errors

### Database Connection Issues

**Problem**: "Cannot connect to database"

**Solutions**:
1. Verify `DATABASE_URL` is correct
2. Ensure the database server is running
3. Check database credentials
4. Verify network connectivity to the database

---

## Production Deployment

### Before Going Live

1. ✅ Test all notification channels thoroughly
2. ✅ Verify all environment variables are set correctly
3. ✅ Run the full test suite: `pnpm test`
4. ✅ Review booking form for any issues
5. ✅ Test admin dashboard functionality
6. ✅ Verify email templates and content

### Deployment Steps

1. Create a checkpoint: `webdev_save_checkpoint`
2. Click "Publish" in the Manus Management UI
3. Configure your custom domain (optional)
4. Monitor logs for any errors

### Monitoring

- Check `.manus-logs/devserver.log` for server errors
- Check `.manus-logs/browserConsole.log` for frontend errors
- Monitor Google Sheets for incoming bookings
- Monitor email inbox for admin notifications
- Check Telegram and LINE for message delivery

---

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review server logs in `.manus-logs/`
3. Verify all environment variables are correctly configured
4. Run the test suite to identify specific issues
5. Contact support at https://help.manus.im

---

## Security Notes

- Never commit `.env` files to version control
- Keep all API keys and tokens secure
- Rotate credentials regularly
- Use strong passwords for all services
- Enable 2FA on all accounts where available
- Review access logs regularly

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Booking Form (Frontend)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Booking API (server/routers.ts)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         Notification Service (notificationService.ts)        │
└──┬──────────────┬──────────────┬──────────────┬─────────────┘
   │              │              │              │
   ▼              ▼              ▼              ▼
Google Sheets  Telegram        LINE          Email
   API          Bot API      Messaging API    SMTP
```

---

Last Updated: March 2026
