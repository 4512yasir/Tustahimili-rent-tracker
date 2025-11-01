const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const salt = 10;
  const adminPass = await bcrypt.hash('Admin@123', salt);
  const agentPass = await bcrypt.hash('Agent@123', salt);

  // create admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tustahimil.local' },
    update: {},
    create: {
      name: 'Tustahimil Admin',
      email: 'admin@tustahimil.local',
      passwordHash: adminPass,
      role: 'ADMIN'
    }
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@tustahimil.local' },
    update: {},
    create: {
      name: 'Agent 1',
      email: 'agent@tustahimil.local',
      passwordHash: agentPass,
      role: 'AGENT'
    }
  });

  // 11 plots
  const plots = [];
  for (let i = 1; i <= 11; i++) {
    const p = await prisma.plot.upsert({
      where: { name: `Plot ${i}` },
      update: {},
      create: {
        name: `Plot ${i}`,
        location: `Location ${i}`,
        expectedMonthlyRent: (50000).toString(), // example
        agentId: agent.id
      }
    });
    plots.push(p);
  }

  console.log('Seed done:', { admin: admin.email, agent: agent.email, plots: plots.length });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
