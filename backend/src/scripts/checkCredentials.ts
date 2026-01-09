import { PrismaClient } from '@prisma/client';
import { decryptPassword } from '../utils/encryption';
import twilio from 'twilio';
import dotenv from 'dotenv';
import path from 'path';

// Load envs same way as valid code
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('Checking stored credentials...');

    // Check Encryption Key presence
    if (!process.env.ENCRYPTION_KEY) {
        console.error('FATAL: ENCRYPTION_KEY is not set in environment! Random key will be used, making decryption impossible across processes.');
    } else {
        console.log('ENCRYPTION_KEY is set (length: ' + process.env.ENCRYPTION_KEY.length + ')');
    }

    const adminSettings = await prisma.adminSettings.findFirst();

    if (!adminSettings) {
        console.log('No AdminSettings found.');
        return;
    }

    console.log('AdminSettings ID:', adminSettings.id);
    console.log('Account SID:', adminSettings.twilioAccountSid);

    try {
        const decryptedToken = decryptPassword(adminSettings.twilioAuthToken);
        console.log('Decrypted Token Length:', decryptedToken.length);
        console.log('Has whitespace?', /\s/.test(decryptedToken));
        console.log('Decrypted Token Preview:', decryptedToken.substring(0, 5) + '...' + decryptedToken.substring(decryptedToken.length - 5));

        if (decryptedToken.length !== 32) {
            console.warn('⚠️  WARNING: Twilio Auth Token should usually be 32 characters long. Yours is ' + decryptedToken.length);
        }

        // Validate with Twilio
        console.log('Testing credentials with Twilio API...');
        // Trim the token just in case that fixes it
        const client = twilio(adminSettings.twilioAccountSid, decryptedToken.trim());

        try {
            const account = await client.api.v2010.accounts(adminSettings.twilioAccountSid).fetch();
            console.log('✅ Success! Authenticated as:', account.friendlyName);
            console.log('Status:', account.status);
        } catch (twilioError: any) {
            console.error('❌ Twilio Auth Failed:', twilioError.message);
            console.error('Code:', twilioError.code);
        }

    } catch (error: any) {
        console.error('❌ Decryption Failed:', error.message);
        if (error.message.includes('bad decrypt') || error.message.includes('wrong final block length')) {
            console.error('This usually means the ENCRYPTION_KEY used to encrypt is different from the one used to decrypt.');
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
