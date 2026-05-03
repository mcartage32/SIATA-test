import { seedClients } from './seeds/clients.seed.js';
import { seedProducts } from './seeds/products.seed.js';
import { seedWarehouses } from './seeds/warehouses.seed.js';
import { seedPorts } from './seeds/ports.seed.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { seedAppUsers } from './seeds/appUsers.seed.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function resetDatabase() {
  console.log('🧹 Cleaning database...');

  await prisma.app_user.deleteMany();
  await prisma.shipment_item.deleteMany();
  await prisma.land_shipment.deleteMany();
  await prisma.sea_shipment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.client.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.port.deleteMany();

  console.log('✅ Database cleaned');
}

async function main() {
  console.log('🌱 Starting database seeding...');

  await resetDatabase();

  await seedAppUsers(prisma);
  console.log('✅ App users seeded');

  await seedClients(prisma);
  console.log('✅ Clients seeded');

  await seedProducts(prisma);
  console.log('✅ Products seeded');

  await seedWarehouses(prisma);
  console.log('✅ Warehouses seeded');

  await seedPorts(prisma);
  console.log('✅ Ports seeded');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
