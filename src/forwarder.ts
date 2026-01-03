import { EmailService } from './services/emailService';
import { WhatsAppService } from './services/whatsappService';
import { AppConfig } from './types';

export class EmailToWhatsAppForwarder {
  private emailService: EmailService;
  private whatsappService: WhatsAppService;

  constructor(config: AppConfig) {
    this.emailService = new EmailService(config.email, config.filters);
    this.whatsappService = new WhatsAppService(config.twilio);
  }

  async run(): Promise<void> {
    console.log('==================================================');
    console.log('Starting Email to WhatsApp Forwarder');
    console.log(`Time: ${new Date().toLocaleString()}`);
    console.log('==================================================');

    try {
      console.log('Connecting to email server...');
      const emails = await this.emailService.fetchEmails();

      if (emails.length === 0) {
        console.log('No emails to forward');
        return;
      }

      console.log(`Found ${emails.length} email(s) to forward`);
      await this.whatsappService.sendBulkEmails(emails);
      
      console.log('Forwarding completed successfully');
    } catch (error) {
      console.error('Error during forwarding process:', error);
      throw error;
    } finally {
      this.emailService.disconnect();
    }
  }

  async runWithErrorHandling(): Promise<void> {
    try {
      await this.run();
    } catch (error: any) {
      if (error.code === 'EAUTH') {
        console.error('Authentication failed. Please check your email credentials.');
      } else if (error.code === 'ECONNREFUSED') {
        console.error('Connection refused. Please check your email host and port.');
      } else if (error.message?.includes('Twilio')) {
        console.error('Twilio error. Please check your Twilio credentials.');
      } else {
        console.error('Unexpected error:', error.message || error);
      }
    }
  }
}