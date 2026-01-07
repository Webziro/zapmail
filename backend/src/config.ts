import dotenv from 'dotenv';

dotenv.config();

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  email: {
    user: getEnvVar('EMAIL_USER', ''),
    password: getEnvVar('EMAIL_PASSWORD', ''),
    host: getEnvVar('EMAIL_HOST', 'imap.gmail.com'),
    port: parseInt(getEnvVar('EMAIL_PORT', '993'), 10),
    tls: getEnvVar('EMAIL_TLS', 'true') === 'true',
  },
  twilio: {
    accountSid: getEnvVar('TWILIO_ACCOUNT_SID', ''),
    authToken: getEnvVar('TWILIO_AUTH_TOKEN', ''),
    senderPhone: getEnvVar('WHATSAPP_SENDER_PHONE', ''),
    recipientPhone: getEnvVar('WHATSAPP_RECIPIENT_PHONE', ''),
  },
  filters: {
    subjects: getEnvVar('FILTER_SUBJECTS', '').split(',').filter(Boolean),
    senders: getEnvVar('FILTER_SENDERS', '').split(',').filter(Boolean),
    hours: parseInt(getEnvVar('FILTER_HOURS', '24'), 10),
  },
  cronSchedule: getEnvVar('CRON_SCHEDULE', '*/10 * * * *'),
};

export default config;