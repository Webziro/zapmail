import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkConnection() {
    console.log('Testing MongoDB connection through Prisma...');
    try {
        // 1. Try a simple count on User
        const userCount = await prisma.user.count();
        console.log(`✅ Success: Connected to Database. Found ${userCount} users.`);

        // 2. Try to access AdminSettings
        const adminSettings = await prisma.adminSettings.findFirst();
        console.log('✅ Success: AdminSettings model is accessible.');

        if (adminSettings) {
            console.log('Found AdminSettings record.');
        } else {
            console.log('No AdminSettings record found, but model is recognized.');
        }

    } catch (error: any) {
        if (error.code === 'P2010') {
            console.error('❌ Connection Timeout (P2010):');
            console.error('The server exists but timed out. Please check:');
            console.error('1. MongoDB Atlas IP Whitelist (add your current IP).');
            console.error('2. Database user credentials in DATABASE_URL.');
        } else {
            console.error('❌ Database error:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

checkConnection();
