import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class ShipmentItemsService {
  async getValidatedProducts(
    tx: Prisma.TransactionClient,
    items: { productMaskUuid: string; quantity: number }[],
  ) {
    const productIds = items.map((i) => i.productMaskUuid);

    const productsRaw = await tx.product.findMany({
      where: { mask_uuid: { in: productIds } },
      select: {
        id: true,
        mask_uuid: true,
        price: true,
      },
    });

    if (productsRaw.length !== items.length) {
      throw new NotFoundException('One or more products not found');
    }

    const products = productsRaw.map((p) => ({
      id: p.id,
      mask_uuid: p.mask_uuid,
      price: Number(p.price),
    }));

    return products;
  }

  buildItems(
    products: { id: number; mask_uuid: string; price: number }[],
    items: { productMaskUuid: string; quantity: number }[],
  ) {
    const productMap = new Map(products.map((p) => [p.mask_uuid, p]));

    return items.map((item) => {
      const product = productMap.get(item.productMaskUuid);

      if (!product) {
        throw new NotFoundException(
          `Product not found: ${item.productMaskUuid}`,
        );
      }

      const total = Number(product.price) * item.quantity;

      return {
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: total,
      };
    });
  }
}
