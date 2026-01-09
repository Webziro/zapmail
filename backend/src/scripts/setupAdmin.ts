import { PrismaClient } from '@prisma/client';
import { encryptPassword } from '../utils/encryption';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function setupAdmin() {
  const existing = await prisma.adminSettings.findFirst();
  
  if (existing) {
    console.log('✅ Admin settings already exist');
    process.exit(0);
  }

  const adminSettings = await prisma.adminSettings.create({
    data: {
      twilioAccountSid: process.env.ADMIN_TWILIO_ACCOUNT_SID!,
      twilioAuthToken: encryptPassword(process.env.ADMIN_TWILIO_AUTH_TOKEN!),
      whatsappSender: process.env.ADMIN_WHATSAPP_SENDER!,
      freeTierLimit: 50,
      premiumPrice: 9.99,
      enablePayments: false,
      enableTrials: true,
      trialDays: 7,
    },
  });

  console.log('✅ Admin settings created:', adminSettings.id);
  process.exit(0);
}

setupAdmin();