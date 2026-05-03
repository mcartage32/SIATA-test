import { ConflictException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

export async function assertNotUsedInShipments(
  tx: Prisma.TransactionClient,
  where: Prisma.shipmentWhereInput,
): Promise<void> {
  const exists = await tx.shipment.findFirst({
    where,
    select: { id: true },
  });

  if (exists) {
    throw new ConflictException('Entity is used in shipments');
  }
}
