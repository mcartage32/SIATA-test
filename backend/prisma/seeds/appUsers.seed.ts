import { PrismaClient } from '../../src/generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

export async function seedAppUsers(prisma: PrismaClient) {
  const password = await bcrypt.hash('123456', 10);

  await prisma.app_user.create({
    data: {
      email: 'admin@test.co',
      password,
    },
  });
}
