import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient as FinanceClient } from '../../prisma/finance_app/client';
import { PrismaClient as VirtualClient, Prisma as VirtualPrisma } from '../../prisma/virtual-perks/client';

// Instantiate Prisma clients
const prismaRaman = new FinanceClient();
const prismaVirtual = new VirtualClient();

async function testFinanceConnection() {
  try {
    const usersCount = await prismaRaman.user.count();
    console.log(`✅ Connected to finance_app DB! Found ${usersCount} users.`);
  } catch (error) {
    console.error("❌ Failed to connect to finance_app DB:", error);
    throw error;
  }
}

async function migrateUsers() {
  console.log("🚀 Starting user migration...");

  // Fetch users with their details
  const users = await prismaRaman.user.findMany({ include: { details: true } });
  console.log(`📥 Fetched ${users.length} users from source DB.`);

  // First pass: Insert basic user records (without details)
  for (const user of users) {
    try {
      await prismaVirtual.user.create({
        data: {
          id: user.id,
          cuid: user.cuid,
          gender: user.gender,
          email: user.email,
          phone: user.phone,
          wallet: user.wallet,
          notes: user.notes,
          sessionId: user.sessionId,
        },
      });
      console.log(`✅ Created user: ${user.email}`);
    } catch (e) {
      console.error(`❌ Failed to create user ${user.email}:`, e);
    }
  }

  // Second pass: Add user details (including managerId)
  for (const user of users) {
    const details = user.details;
    if (!details) continue;

    try {
      await prismaVirtual.user.update({
        where: { id: user.id },
        data: {
          details: {
            create: {
              name: details.name,
              departmentId: details.departmentId,
              salary: details.salary,
              userType: details.userType,
              managerId: details.managerId,
              isApproved: details.isApproved,
              extras: details.extras ?? VirtualPrisma.JsonNull,
              timeoffAllowance: details.timeoffAllowance ?? VirtualPrisma.JsonNull,
              createdAt: details.createdAt,
              updatedAt: details.updatedAt,
              createdBy: details.createdBy,
              updatedBy: details.updatedBy,
            },
          },
        },
      });
      console.log(`📝 Added details for user: ${user.email}`);
    } catch (e) {
      console.error(`❌ Failed to add details for user ${user.email}:`, e);
    }
  }

  console.log("✅ Migration complete!");
}

async function main() {
  try {
    await testFinanceConnection();
    await migrateUsers();
  } catch (err) {
    console.error("❌ Migration script failed:", err);
  } finally {
    await prismaRaman.$disconnect();
    await prismaVirtual.$disconnect();
    console.log("🔌 Disconnected from both databases.");
  }
}

main();
