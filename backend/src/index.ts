import cron from 'node-cron';
import config from './config';
import { EmailToWhatsAppForwarder } from './forwarder';

const forwarder = new EmailToWhatsAppForwarder(config);

async function runOnce() {
  console.log('Running email forwarder once...');
  await forwarder.runWithErrorHandling();
}

function startScheduler() {
  console.log('='.repeat(60));
  console.log('Email to WhatsApp Forwarder');
  console.log('='.repeat(60));
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Schedule: ${config.cronSchedule}`);
  console.log(`Email: ${config.email.user}`);
  console.log(`WhatsApp Recipient: ${config.twilio.recipientPhone}`);
  console.log(`Filters:`);
  console.log(`  - Subjects: ${config.filters.subjects.join(', ') || 'None'}`);
  console.log(`  - Senders: ${config.filters.senders.join(', ') || 'None'}`);
  console.log(`  - Time window: Last ${config.filters.hours} hours`);
  console.log('='.repeat(60));

  if (!cron.validate(config.cronSchedule)) {
    console.error('Invalid cron schedule format');
    process.exit(1);
  }

  console.log('Starting scheduler...');
  console.log('Press Ctrl+C to stop\n');

  runOnce();

  cron.schedule(config.cronSchedule, async () => {
    await forwarder.runWithErrorHandling();
  });
}

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down...');
  process.exit(0);
});

if (require.main === module) {
  startScheduler();
}

export { runOnce, startScheduler };