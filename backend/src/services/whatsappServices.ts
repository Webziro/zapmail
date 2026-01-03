import twilio from 'twilio';
import { TwilioConfig, ParsedEmail } from '../types';

export class WhatsAppService {
  private client: twilio.Twilio;
  private config: TwilioConfig;

  constructor(twilioConfig: TwilioConfig) {
    this.config = twilioConfig;
    this.client = twilio(twilioConfig.accountSid, twilioConfig.authToken);
  }

  async sendEmail(email: ParsedEmail): Promise<void> {
    try {
      const message = this.formatEmailMessage(email);
      
      const result = await this.client.messages.create({
        body: message,
        from: this.config.senderPhone,
        to: this.config.recipientPhone,
      });

      console.log(`WhatsApp message sent successfully. SID: ${result.sid}`);

      if (email.attachments && email.attachments.length > 0) {
        console.log(`Note: ${email.attachments.length} attachment(s) found but not sent (WhatsApp API limitation)`);
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async sendBulkEmails(emails: ParsedEmail[]): Promise<void> {
    console.log(`Sending ${emails.length} emails to WhatsApp...`);
    
    for (let i = 0; i < emails.length; i++) {
      try {
        await this.sendEmail(emails[i]);
        console.log(`Sent email ${i + 1}/${emails.length}`);
        
        if (i < emails.length - 1) {
          await this.delay(2000);
        }
      } catch (error) {
        console.error(`Failed to send email ${i + 1}:`, error);
      }
    }
  }

  private formatEmailMessage(email: ParsedEmail): string {
    const maxLength = 1500;
    let message = `📧 *New Email*\n\n`;
    message += `*From:* ${email.from}\n`;
    message += `*Subject:* ${email.subject}\n`;
    message += `*Date:* ${email.date.toLocaleString()}\n`;
    message += `\n---\n\n`;
    
    const bodyText = email.text || 'No content';
    const truncatedBody = bodyText.length > maxLength 
      ? bodyText.substring(0, maxLength) + '...\n\n[Message truncated]'
      : bodyText;
    
    message += truncatedBody;

    if (email.attachments && email.attachments.length > 0) {
      message += `\n\n📎 *Attachments:* ${email.attachments.length}`;
      email.attachments.forEach(att => {
        message += `\n  • ${att.filename} (${this.formatBytes(att.size)})`;
      });
    }

    return message;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}