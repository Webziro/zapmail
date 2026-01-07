import Imap from 'imap';
import { simpleParser, ParsedMail } from 'mailparser';
import { EmailConfig, EmailFilters, ParsedEmail } from '../types';

export class EmailService {
  private imap: Imap;
  private filters: EmailFilters;

  constructor(emailConfig: EmailConfig, filters: EmailFilters) {
    this.filters = filters;
    this.imap = new Imap({
      user: emailConfig.user,
      password: emailConfig.password,
      host: emailConfig.host,
      port: emailConfig.port,
      tls: emailConfig.tls,
      tlsOptions: { rejectUnauthorized: false },
    });
  }

  async fetchEmails(): Promise<ParsedEmail[]> {
    return new Promise((resolve, reject) => {
      const emails: ParsedEmail[] = [];

      this.imap.once('ready', () => {
        this.imap.openBox('INBOX', true, (err) => {
          if (err) {
            reject(err);
            return;
          }

          const searchCriteria = this.buildSearchCriteria();
          
          this.imap.search(searchCriteria, (searchErr, results) => {
            if (searchErr) {
              reject(searchErr);
              return;
            }

            if (results.length === 0) {
              console.log('No new emails found matching filters');
              this.imap.end();
              resolve(emails);
              return;
            }

            const fetch = this.imap.fetch(results, { bodies: '' });
            let processedCount = 0;

            fetch.on('message', (msg) => {
              msg.on('body', (stream) => {
                simpleParser(stream as any).then((parsed: ParsedMail) => {
                  const email: ParsedEmail = {
                    subject: parsed.subject || 'No Subject',
                    from: parsed.from?.text || 'Unknown',
                    date: parsed.date || new Date(),
                    text: parsed.text || '',
                    html: parsed.html as string || undefined,
                    attachments: parsed.attachments?.map(att => ({
                      filename: att.filename || 'unknown',
                      contentType: att.contentType || 'application/octet-stream',
                      size: att.size || 0,
                      content: att.content,
                    })),
                  };

                  if (this.matchesFilters(email)) {
                    emails.push(email);
                  }
                }).catch((parseErr) => {
                  console.error('Error parsing email:', parseErr);
                });
              });

              msg.once('end', () => {
                processedCount++;
                if (processedCount === results.length) {
                  this.imap.end();
                }
              });
            });

            fetch.once('error', (fetchErr) => {
              reject(fetchErr);
            });

            fetch.once('end', () => {
              console.log(`Processed ${emails.length} emails matching filters`);
              resolve(emails);
            });
          });
        });
      });

      this.imap.once('error', (err) => {
        reject(err);
      });

      this.imap.once('end', () => {
        console.log('IMAP connection ended');
      });

      this.imap.connect();
    });
  }

  private buildSearchCriteria(): any[] {
    const criteria: any[] = ['UNSEEN'];
    
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - this.filters.hours);
    criteria.push(['SINCE', cutoffDate]);

    return criteria;
  }

  private matchesFilters(email: ParsedEmail): boolean {
    if (this.filters.subjects.length > 0) {
      const subjectMatch = this.filters.subjects.some(keyword =>
        email.subject.toLowerCase().includes(keyword.toLowerCase())
      );
      if (!subjectMatch) return false;
    }

    if (this.filters.senders.length > 0) {
      const senderMatch = this.filters.senders.some(sender =>
        email.from.toLowerCase().includes(sender.toLowerCase())
      );
      if (!senderMatch) return false;
    }

    return true;
  }

  disconnect(): void {
    if (this.imap) {
      this.imap.end();
    }
  }
}