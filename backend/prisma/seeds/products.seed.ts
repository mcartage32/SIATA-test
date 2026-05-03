import { PrismaClient } from '../../src/generated/prisma/client.js';

export async function seedProducts(prisma: PrismaClient) {
  await prisma.product.createMany({
    data: [
      { name: 'PlayStation 5', price: 499 },
      { name: 'Xbox Series X', price: 499 },
      { name: 'Xbox Series S', price: 299 },
      { name: 'Nintendo Switch OLED', price: 349 },
      { name: 'Steam Deck 512GB', price: 649 },
      { name: 'DualSense Controller', price: 69 },
      { name: 'Xbox Controller', price: 65 },
      { name: 'PS5 Digital Edition', price: 449 },
      { name: 'Gaming Headset HyperX', price: 120 },
      { name: 'Logitech G Pro Mouse', price: 99 },
    ],
    skipDuplicates: true,
  });
}
