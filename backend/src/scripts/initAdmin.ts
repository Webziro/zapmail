import { PrismaClient } from '@prisma/client';
import { encryptPassword } from '../utils/encryption';
import dotenv from 'dotenv';
import path from 'path';

// Force load env from current and parent directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('Current directory:', process.cwd());

    const accountSid = process.env.ADMIN_TWILIO_ACCOUNT_SID;
    const authToken = process.env.ADMIN_TWILIO_AUTH_TOKEN;
    const senderPhone = process.env.ADMIN_WHATSAPP_SENDER;

    console.log('Env check - ADMIN_TWILIO_ACCOUNT_SID present:', !!accountSid);
    if (accountSid) {
        console.log('Env check - ADMIN_TWILIO_ACCOUNT_SID value starts with:', accountSid.substring(0, 3));
    }

    if (!accountSid || !authToken || !senderPhone) {
        console.error('Missing Twilio configuration in environment variables.');
        console.error('Ensure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and WHATSAPP_SENDER_PHONE are set in .env');
        process.exit(1);
    }

    console.log('Checking for existing Admin Settings...');
    const existingAdmin = await prisma.adminSettings.findFirst();

    if (existingAdmin) {
        console.log('Admin settings already exist. Updating...');
        await prisma.adminSettings.update({
            where: { id: existingAdmin.id },
            data: {
                twilioAccountSid: accountSid,
                twilioAuthToken: encryptPassword(authToken),
                whatsappSender: senderPhone,
            },
        });
        console.log('Admin settings updated successfully.');
    } else {
        console.log('Creating Admin Settings...');
        await prisma.adminSettings.create({
            data: {
                twilioAccountSid: accountSid,
                twilioAuthToken: encryptPassword(authToken),
                whatsappSender: senderPhone,
            },
        });
        console.log('Admin settings created successfully.');
    }
}

main()
    .catch((e) => {
        console.error('Error creating/updating admin settings:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
