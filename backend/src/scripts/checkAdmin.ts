import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

async function main() {
    const adminSettings = await prisma.adminSettings.findFirst();

    if (!adminSettings) {
        console.log('No AdminSettings found.');
        return;
    }

    console.log('AdminSettings Found:');
    console.log('ID:', adminSettings.id);
    console.log('Twilio Account SID:', adminSettings.twilioAccountSid);
    console.log('WhatsApp Sender:', adminSettings.whatsappSender);
    console.log('Encrypted Auth Token Length:', adminSettings.twilioAuthToken.length);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
