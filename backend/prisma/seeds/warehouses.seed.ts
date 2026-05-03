import { PrismaClient } from '../../src/generated/prisma/client.js';

export async function seedWarehouses(prisma: PrismaClient) {
  await prisma.warehouse.createMany({
    data: [
      { name: 'Bodega 1', location: 'Medellín' },
      { name: 'Bodega 2', location: 'Bogotá' },
      { name: 'Bodega 3', location: 'Cali' },
      { name: 'Bodega 4', location: 'Barranquilla' },
      { name: 'Bodega 5', location: 'Bucaramanga' },
    ],
    skipDuplicates: true,
  });
}
