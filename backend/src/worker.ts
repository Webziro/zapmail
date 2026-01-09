import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { EmailService } from './services/emailService';
import { WhatsAppService } from './services/whatsappService';
import { decryptPassword } from './utils/encryption';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function processRule(rule: any, adminSettings: any) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing rule: ${rule.name} (${rule.id})`);
  console.log(`User: ${rule.user.email}`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));

  try {
    if (!adminSettings) {
      throw new Error('Admin settings not found. Cannot process rules.');
    }

    if (!rule.user.whatsappNumber) {
      throw new Error('User does not have a WhatsApp number configured.');
    }

    const emailConfig = {
      user: rule.emailUser,
      password: decryptPassword(rule.emailPassword),
      host: rule.emailHost,
      port: rule.emailPort,
      tls: rule.emailTls,
    };

    const filters = {
      subjects: rule.filterSubjects,
      senders: rule.filterSenders,
      hours: rule.filterHours,
    };

    const twilioConfig = {
      accountSid: adminSettings.twilioAccountSid,
      authToken: decryptPassword(adminSettings.twilioAuthToken),
      senderPhone: adminSettings.whatsappSender,
      recipientPhone: rule.user.whatsappNumber,
    };

    const emailService = new EmailService(emailConfig, filters);
    const whatsappService = new WhatsAppService(twilioConfig);

    const emails = await emailService.fetchEmails();

    if (emails.length === 0) {
      console.log('No emails to forward');
      return;
    }

    console.log(`Found ${emails.length} email(s) to forward`);

    for (const email of emails) {
      try {
        await whatsappService.sendEmail(email);

        await prisma.forwardingLog.create({
          data: {
            userId: rule.userId,
            ruleId: rule.id,
            emailSubject: email.subject,
            emailFrom: email.from,
            emailDate: email.date,
            status: 'success',
          },
        });

        console.log(`✓ Forwarded: ${email.subject}`);
      } catch (error: any) {
        await prisma.forwardingLog.create({
          data: {
            userId: rule.userId,
            ruleId: rule.id,
            emailSubject: email.subject,
            emailFrom: email.from,
            emailDate: email.date,
            status: 'failed',
            error: error.message,
          },
        });

        console.error(`✗ Failed to forward: ${email.subject}`, error.message);
      }
    }

    emailService.disconnect();
  } catch (error: any) {
    console.error(`Error processing rule ${rule.name}:`, error.message);
  }
}

async function processAllRules() {
  try {
    const adminSettings = await prisma.adminSettings.findFirst();

    const activeRules = await prisma.forwardingRule.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            whatsappNumber: true,
          },
        },
      },
    });

    if (activeRules.length === 0) {
      console.log('No active rules to process');
      return;
    }

    console.log(`\nProcessing ${activeRules.length} active rule(s)...`);

    for (const rule of activeRules) {
      await processRule(rule, adminSettings);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\nAll rules processed successfully');
  } catch (error) {
    console.error('Error processing rules:', error);
  }
}

function startWorker() {
  const schedule = process.env.WORKER_CRON_SCHEDULE || '*/5 * * * *';

  console.log('='.repeat(60));
  console.log('Email to WhatsApp Forwarder - Background Worker');
  console.log('='.repeat(60));
  console.log(`Schedule: ${schedule}`);
  console.log(`Started at: ${new Date().toLocaleString()}`);
  console.log('Press Ctrl+C to stop');
  console.log('='.repeat(60));

  processAllRules();

  cron.schedule(schedule, async () => {
    await processAllRules();
  });
}

process.on('SIGINT', () => {
  console.log('\nShutting down worker gracefully...');
  prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down worker...');
  prisma.$disconnect();
  process.exit(0);
});

if (require.main === module) {
  startWorker();
}

export { processAllRules, processRule };