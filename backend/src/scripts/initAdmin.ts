import { PrismaClient } from '@prisma/client';
import { encryptPassword } from '../utils/encryption';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
dotenv.config({ path: '../.env' });

console.log('Current directory:', process.cwd());
console.log('Env check - TWILIO_ACCOUNT_SID present:', !!process.env.TWILIO_ACCOUNT_SID);


const prisma = new PrismaClient();
console.error('Missing Twilio configuration in environment variables.');
console.error('Ensure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and WHATSAPP_SENDER_PHONE are set in .env');
process.exit(1);
    }

console.log('Creating Admin Settings...');
await prisma.adminSettings.create({
    data: {
        twilioAccountSid: accountSid,
        twilioAuthToken: encryptPassword(authToken),
        whatsappSender: senderPhone,
        // Default values for other fields will be used
    },
});

console.log('Admin settings created successfully.');
}

main()
    .catch((e) => {
        console.error('Error creating admin settings:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
