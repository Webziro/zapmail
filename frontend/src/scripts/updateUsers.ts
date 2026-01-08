import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExistingUsers() {
  const users = await prisma.user.findMany();
  
  console.log(`Found ${users.length} users to update`);
  
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        whatsappNumber: null, // They'll add it in profile
        messagesUsed: 0,
        messagesLimit: 50,
        subscriptionTier: 'FREE',
        subscriptionStatus: 'ACTIVE',
      },
    });
  }
  
  console.log('All users updated!');
  process.exit(0);
}

updateExistingUsers();