// test-db.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const users = await prisma.user.findMany();
  console.log("✅ MongoDB connected successfully!");
  console.log("Current users:", users);
  process.exit(0);
};

main().catch((e) => {
  console.error("❌ Connection failed:", e);
  process.exit(1);
});
