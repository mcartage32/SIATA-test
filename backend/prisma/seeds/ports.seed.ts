import { PrismaClient } from '../../src/generated/prisma/client.js';

export async function seedPorts(prisma: PrismaClient) {
  await prisma.port.createMany({
    data: [
      { name: 'Puerto 1', location: 'Cartagena' },
      { name: 'Puerto 2', location: 'Buenaventura' },
      { name: 'Puerto 3', location: 'Santa Marta' },
      { name: 'Puerto 4', location: 'Turbo' },
      { name: 'Puerto 5', location: 'Barranquilla' },
    ],
    skipDuplicates: true,
  });
}
