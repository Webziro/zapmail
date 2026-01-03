# Email to WhatsApp Forwarder

A Node.js application that automatically fetches emails based on custom filters and forwards them to WhatsApp using the Twilio API.

## Features

- ✉️ Connect to email accounts via IMAP (Gmail, Outlook, etc.)
- 🔍 Filter emails by subject keywords, sender addresses, and timeframe
- 📱 Forward email content to WhatsApp via Twilio
- ⏰ Scheduled execution with customizable cron jobs
- 🛡️ Robust error handling and logging
- 📎 Attachment detection and notification
- ☁️ Cloud-ready deployment (Heroku, AWS, etc.)

## Prerequisites

1. **Email Account**
   - Gmail, Outlook, or any IMAP-enabled email provider
   - App-specific password (for Gmail: [Generate App Password](https://myaccount.google.com/apppasswords))

2. **Twilio Account**
   - Sign up at [Twilio](https://www.twilio.com/try-twilio)
   - Set up WhatsApp Sandbox: [Twilio WhatsApp Sandbox](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
   - Get your Account SID and Auth Token from the Twilio Console

3. **Node.js**
   - Version 14.x or higher

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd email-whatsapp-forwarder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_TLS=true

# Email Filters (comma-separated)
FILTER_SUBJECTS=urgent,important
FILTER_SENDERS=john.doe@example.com,jane.smith@example.com
FILTER_HOURS=24

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
WHATSAPP_SENDER_PHONE=whatsapp:+14155238886
WHATSAPP_RECIPIENT_PHONE=whatsapp:+2348100000000

# Cron Schedule (every 10 minutes by default)
CRON_SCHEDULE=*/10 * * * *
```

### 4. Build the Application

```bash
npm run build
```

## Usage

### Run Once (Development)

```bash
npm run dev
```

### Run with Scheduler

```bash
npm start
```

The application will:
1. Run immediately on startup
2. Continue running based on the cron schedule
3. Check for new emails matching your filters
4. Forward matching emails to WhatsApp

## Configuration Details

### Email Filters

- **FILTER_SUBJECTS**: Comma-separated keywords (case-insensitive)
  - Example: `urgent,important,action required`
  - Leave empty to disable subject filtering

- **FILTER_SENDERS**: Comma-separated email addresses
  - Example: `boss@company.com,client@business.com`
  - Leave empty to disable sender filtering

- **FILTER_HOURS**: Time window for fetching emails
  - Example: `24` (last 24 hours)
  - Default: 24

### Cron Schedule Format

The `CRON_SCHEDULE` uses standard cron syntax:

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Examples:**
- `*/10 * * * *` - Every 10 minutes
- `0 * * * *` - Every hour
- `0 9 * * *` - Every day at 9 AM
- `0 9,17 * * *` - Every day at 9 AM and 5 PM

## Gmail Setup

### Enable IMAP

1. Go to Gmail Settings → See all settings
2. Click the "Forwarding and POP/IMAP" tab
3. Enable IMAP
4. Save changes

### Generate App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Other (Custom name)"
5. Copy the 16-character password
6. Use this password in `EMAIL_PASSWORD`

## Twilio WhatsApp Setup

### 1. Activate WhatsApp Sandbox

1. Log in to [Twilio Console](https://console.twilio.com/)
2. Navigate to Messaging → Try it out → Send a WhatsApp message
3. Follow instructions to join the sandbox
4. Send the provided code to the Twilio WhatsApp number

### 2. Get Credentials

- **Account SID**: Found in your Twilio Console dashboard
- **Auth Token**: Found in your Twilio Console dashboard (click "Show" to reveal)
- **Sender Phone**: `whatsapp:+14155238886` (Twilio sandbox number)
- **Recipient Phone**: Format as `whatsapp:+[country code][number]`

## Deployment

### Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-app-password
   heroku config:set TWILIO_ACCOUNT_SID=your-sid
   heroku config:set TWILIO_AUTH_TOKEN=your-token
   # ... set all other variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Scale Worker**
   ```bash
   heroku ps:scale worker=1
   ```

7. **View Logs**
   ```bash
   heroku logs --tail
   ```

### AWS (EC2)

1. **Launch EC2 Instance**
   - Choose Ubuntu Server
   - Configure security groups

2. **SSH into Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd email-whatsapp-forwarder
   npm install
   npm run build
   ```

5. **Create .env File**
   ```bash
   nano .env
   # Paste your configuration
   ```

6. **Run with PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start dist/index.js --name email-forwarder
   pm2 startup
   pm2 save
   ```

## Troubleshooting

### Authentication Errors

- **Gmail**: Ensure you're using an app password, not your regular password
- **Twilio**: Verify your Account SID and Auth Token are correct

### No Emails Found

- Check your filter configuration
- Verify emails exist in the specified timeframe
- Ensure emails are unread (the app only processes unseen emails)

### WhatsApp Not Receiving Messages

- Verify you've joined the Twilio WhatsApp Sandbox
- Check phone number format: `whatsapp:+[country code][number]`
- Review Twilio logs in the console

### IMAP Connection Issues

- Verify IMAP is enabled in your email account
- Check host and port settings
- Ensure firewall isn't blocking the connection

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use environment variables** for all credentials
3. **Rotate credentials** regularly
4. **Limit email permissions** to read-only if possible
5. **Monitor Twilio usage** to prevent unauthorized access

## Limitations

- WhatsApp messages are limited to 1600 characters
- Email attachments are listed but not sent (Twilio limitation)
- Free Twilio accounts have usage limits
- Gmail app passwords require 2-factor authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review [Twilio Documentation](https://www.twilio.com/docs/whatsapp)
- Open an issue on GitHub

## Acknowledgments

- Built with [Node.js](https://nodejs.org/)
- Email processing by [node-imap](https://github.com/mscdex/node-imap)
- WhatsApp integration via [Twilio](https://www.twilio.com/)