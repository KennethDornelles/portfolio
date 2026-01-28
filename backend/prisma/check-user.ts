import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function checkUser() {
  const email = process.env.ADMIN_EMAIL || 'kennetholusegun@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'Olupa198@';
  
  console.log(`\n🔍 Checking user: ${email}\n`);
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log('❌ User NOT FOUND in database!');
    console.log('\n💡 Run: npm run seed (with ADMIN_EMAIL and ADMIN_PASSWORD set in .env)');
  } else {
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    
    // Test password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log(`\n🔐 Password match: ${isMatch ? '✅ YES' : '❌ NO'}`);
    
    if (!isMatch) {
      console.log(`\n💡 The stored hash doesn't match the password "${password}"`);
      console.log('   You may need to delete the user and re-run seed with correct password.');
    }
  }
  
  // List all users
  console.log('\n📋 All users in database:');
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, role: true, isActive: true }
  });
  console.table(allUsers);
  
  await prisma.$disconnect();
}

checkUser().catch(console.error);
