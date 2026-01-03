export interface EmailConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  senderPhone: string;
  recipientPhone: string;
}

export interface EmailFilters {
  subjects: string[];
  senders: string[];
  hours: number;
}

export interface ParsedEmail {
  subject: string;
  from: string;
  date: Date;
  text: string;
  html?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  content: Buffer;
}

export interface AppConfig {
  email: EmailConfig;
  twilio: TwilioConfig;
  filters: EmailFilters;
  cronSchedule: string;
}