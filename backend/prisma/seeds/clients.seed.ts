import { PrismaClient } from '../../src/generated/prisma/client.js';

export async function seedClients(prisma: PrismaClient) {
  await prisma.client.createMany({
    data: [
      { name: 'Carlos Pérez', email: 'carlos@gmail.com' },
      { name: 'María Gómez', email: 'maria@gmail.com' },
      { name: 'Andrés López', email: 'andres@gmail.com' },
      { name: 'Laura Rodríguez', email: 'laura@gmail.com' },
      { name: 'Juan Martínez', email: 'juan@gmail.com' },
    ],
    skipDuplicates: true,
  });
}
