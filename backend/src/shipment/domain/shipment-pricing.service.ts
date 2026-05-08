/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { ShipmentType } from '../dtos/create-shipment.dto.js';
import { ShipmentDomain } from './shipment.domain.js';

@Injectable()
export class ShipmentPricingService {
  calculatePricing(
    type: ShipmentType,
    items: { quantity: number; productMaskUuid: string }[],
    products: { price: number; mask_uuid: string }[],
  ) {
    let basePrice = 0;

    const productMap = new Map(products.map((p) => [p.mask_uuid, p]));

    const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);

    for (const item of items) {
      const product = productMap.get(item.productMaskUuid as any);
      if (!product) continue;

      basePrice += Number(product.price) * item.quantity;
    }

    const discountPercent = ShipmentDomain.calculateDiscount(
      type,
      totalQuantity,
    );

    const discountAmount = (basePrice * discountPercent) / 100;
    const totalPrice = basePrice - discountAmount;

    ShipmentDomain.validateTotalPrice(totalPrice);

    return {
      basePrice,
      discountPercent,
      discountAmount,
      totalPrice,
    };
  }
}
