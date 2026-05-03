/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateShipmentDto, ShipmentType } from './dtos/create-shipment.dto.js';
import { handlePrismaError } from '../common/errors/prisma-error.handler.js';
import {
  SHIPMENT_DETAIL_SELECT,
  SHIPMENT_SELECT,
} from './constants/shipment.select.js';
import { Prisma } from '../generated/prisma/client.js';
import { validateFutureDate } from '../common/utils/date.util.js';
import { ShipmentDomain } from './shipment.domain.js';
import { getPagination } from '../common/utils/pagination.util.js';
import { QueryShipmentDto } from './dtos/query-shipment.dto.js';
import { UpdateShipmentDto } from './dtos/update-shipment.dto.js';

@Injectable()
export class ShipmentService {
  constructor(private readonly prisma: PrismaService) {}

  // Metodo para generar el numero de guia unico con validacion en BD
  private async generateUniqueGuideNumber(
    tx: Prisma.TransactionClient,
  ): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < 5; i++) {
      const guide = Array.from({ length: 10 })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('');

      const exists = await tx.shipment.findUnique({
        where: { guide_number: guide },
        select: { id: true },
      });

      if (!exists) return guide;
    }

    throw new BadRequestException('Failed to generate unique guide number');
  }

  // Borrar relaciones de la tabla envios
  private async deleteRelations(
    tx: Prisma.TransactionClient,
    shipmentId: number,
  ) {
    await Promise.all([
      tx.shipment_item.deleteMany({ where: { shipment_id: shipmentId } }),
      tx.land_shipment.deleteMany({ where: { shipment_id: shipmentId } }),
      tx.sea_shipment.deleteMany({ where: { shipment_id: shipmentId } }),
    ]);
  }

  async create(dto: CreateShipmentDto, userEmail: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // =========================
        // 0. DOMAIN VALIDATIONS
        // =========================
        ShipmentDomain.validateCreationInput(dto);
        ShipmentDomain.validateTypeSpecific(dto);

        const deliveryDate = validateFutureDate(dto.deliveryDate);

        // =========================
        // 1. CLIENT
        // =========================
        const client = await tx.client.findUnique({
          where: { mask_uuid: dto.clientMaskUuid },
          select: { id: true },
        });

        if (!client) throw new NotFoundException('Client not found');

        // =========================
        // 2. PRODUCTS
        // =========================
        const productIds = dto.items.map((i) => i.productMaskUuid);

        const products = await tx.product.findMany({
          where: {
            mask_uuid: { in: productIds },
          },
          select: {
            id: true,
            mask_uuid: true,
            price: true,
          },
        });

        if (products.length !== dto.items.length) {
          throw new NotFoundException('One or more products not found');
        }

        // =========================
        // 3. CALCULATE PRICES
        // =========================
        let basePrice = 0;

        const productMap = new Map(products.map((p) => [p.mask_uuid, p]));

        const itemsData = dto.items.map((item) => {
          const product = productMap.get(item.productMaskUuid);

          if (!product) {
            throw new NotFoundException(
              `Product not found: ${item.productMaskUuid}`,
            );
          }

          const total = Number(product.price) * item.quantity;

          basePrice += total;

          return {
            product_id: product.id,
            quantity: item.quantity,
            unit_price: product.price,
            total_price: total,
          };
        });

        // =========================
        // 4. DISCOUNT LOGIC
        // =========================
        const totalQuantity = dto.items.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );

        const discountPercent = ShipmentDomain.calculateDiscount(
          dto.type,
          totalQuantity,
        );

        const discountAmount = (basePrice * discountPercent) / 100;
        const totalPrice = basePrice - discountAmount;

        ShipmentDomain.validateTotalPrice(totalPrice);

        // =========================
        // 5. CREATE SHIPMENT
        // =========================
        const shipment = await tx.shipment.create({
          data: {
            type: dto.type,
            client_id: client.id,
            base_price: basePrice,
            discount_percent: discountPercent,
            discount_amount: discountAmount,
            total_price: totalPrice,
            guide_number: await this.generateUniqueGuideNumber(tx),
            created_by: userEmail,
            delivery_date: deliveryDate,
          },
          select: {
            id: true,
            ...SHIPMENT_SELECT,
          },
        });

        // =========================
        // 6. CREATE ITEMS
        // =========================
        await tx.shipment_item.createMany({
          data: itemsData.map((item) => ({
            ...item,
            shipment_id: shipment.id,
          })),
        });

        // =========================
        // 7. TYPE SPECIFIC
        // =========================
        if (dto.type === ShipmentType.LAND) {
          const warehouse = await tx.warehouse.findUnique({
            where: { mask_uuid: dto.warehouseMaskUuid! },
            select: { id: true },
          });

          if (!warehouse) {
            throw new NotFoundException('Warehouse not found');
          }

          await tx.land_shipment.create({
            data: {
              shipment_id: shipment.id,
              warehouse_id: warehouse.id,
              vehicle_plate: dto.vehiclePlate!,
              created_by: userEmail,
            },
          });
        }

        if (dto.type === ShipmentType.SEA) {
          const port = await tx.port.findUnique({
            where: { mask_uuid: dto.portMaskUuid! },
            select: { id: true },
          });

          if (!port) {
            throw new NotFoundException('Port not found');
          }

          await tx.sea_shipment.create({
            data: {
              shipment_id: shipment.id,
              port_id: port.id,
              fleet_number: dto.fleetNumber!,
              created_by: userEmail,
            },
          });
        }

        const { id, ...safeShipment } = shipment;
        return safeShipment;
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAll(query: QueryShipmentDto) {
    const { page, limit, skip } = getPagination(query);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.shipment.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: SHIPMENT_DETAIL_SELECT,
      }),
      this.prisma.shipment.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
  async findOne(maskUuid: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { mask_uuid: maskUuid },
      select: SHIPMENT_DETAIL_SELECT,
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }

  async remove(maskUuid: string): Promise<{ message: string }> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const shipment = await tx.shipment.findUnique({
          where: { mask_uuid: maskUuid },
          select: { id: true },
        });

        if (!shipment) {
          throw new NotFoundException('Shipment not found');
        }

        const shipmentId = shipment.id;

        // Eliminar relaciones (items, sea y land)
        await this.deleteRelations(tx, shipmentId);

        // Eliminar shipment principal
        await tx.shipment.delete({
          where: { id: shipmentId },
        });
      });

      return { message: 'Shipment deleted successfully' };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(maskUuid: string, dto: UpdateShipmentDto, userEmail: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // =========================
        // 1. SHIPMENT EXISTENTE
        // =========================
        const existing = await tx.shipment.findUnique({
          where: { mask_uuid: maskUuid },
          select: {
            id: true,
            type: true,
          },
        });

        if (!existing) {
          throw new NotFoundException('Shipment not found');
        }

        const shipmentId = existing.id;

        // =========================
        // 2. VALIDACIONES
        // =========================

        let deliveryDate: Date | undefined;
        if (dto.deliveryDate) {
          deliveryDate = validateFutureDate(dto.deliveryDate);
        }

        // Validaciones por tipo
        if (existing.type === ShipmentType.LAND) {
          if (dto.portMaskUuid || dto.fleetNumber) {
            throw new BadRequestException(
              'Cannot set port/fleet for LAND shipment',
            );
          }
        }

        if (existing.type === ShipmentType.SEA) {
          if (dto.warehouseMaskUuid || dto.vehiclePlate) {
            throw new BadRequestException(
              'Cannot set warehouse/vehicle for SEA shipment',
            );
          }
        }

        // =========================
        // 3. PREPARAR UPDATE BASE
        // =========================

        const updateData: any = {
          updated_by: userEmail,
          updated_at: new Date(),
        };

        if (deliveryDate) {
          updateData.delivery_date = deliveryDate;
        }

        // =========================
        // 4. ITEMS (SI VIENEN)
        // =========================
        if (dto.items?.length) {
          const productIds = dto.items.map((i) => i.productMaskUuid);

          const products = await tx.product.findMany({
            where: { mask_uuid: { in: productIds } },
            select: {
              id: true,
              mask_uuid: true,
              price: true,
            },
          });

          if (products.length !== dto.items.length) {
            throw new NotFoundException('One or more products not found');
          }

          let basePrice = 0;

          const productMap = new Map(products.map((p) => [p.mask_uuid, p]));

          const itemsData = dto.items.map((item) => {
            const product = productMap.get(item.productMaskUuid)!;

            const total = Number(product.price) * item.quantity;
            basePrice += total;

            return {
              product_id: product.id,
              quantity: item.quantity,
              unit_price: product.price,
              total_price: total,
            };
          });

          const totalQuantity = dto.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );

          if (
            !Object.values(ShipmentType).includes(existing.type as ShipmentType)
          ) {
            throw new BadRequestException('Invalid shipment type');
          }

          const discountPercent = ShipmentDomain.calculateDiscount(
            existing.type as ShipmentType,
            totalQuantity,
          );

          const discountAmount = (basePrice * discountPercent) / 100;
          const totalPrice = basePrice - discountAmount;

          ShipmentDomain.validateTotalPrice(totalPrice);

          // actualizar precios
          Object.assign(updateData, {
            base_price: basePrice,
            discount_percent: discountPercent,
            discount_amount: discountAmount,
            total_price: totalPrice,
          });

          // reemplazar items
          await tx.shipment_item.deleteMany({
            where: { shipment_id: shipmentId },
          });

          await tx.shipment_item.createMany({
            data: itemsData.map((item) => ({
              ...item,
              shipment_id: shipmentId,
            })),
          });
        }

        // =========================
        // 5. UPDATE SHIPMENT
        // =========================
        await tx.shipment.update({
          where: { id: shipmentId },
          data: updateData,
          select: {
            id: true,
            ...SHIPMENT_SELECT,
          },
        });

        // =========================
        // 6. LOGÍSTICA
        // =========================

        if (existing.type === ShipmentType.LAND) {
          if (dto.warehouseMaskUuid || dto.vehiclePlate) {
            const warehouse = dto.warehouseMaskUuid
              ? await tx.warehouse.findUnique({
                  where: { mask_uuid: dto.warehouseMaskUuid },
                  select: { id: true },
                })
              : null;

            if (dto.warehouseMaskUuid && !warehouse) {
              throw new NotFoundException('Warehouse not found');
            }

            await tx.land_shipment.updateMany({
              where: { shipment_id: shipmentId },
              data: {
                ...(warehouse && { warehouse_id: warehouse.id }),
                ...(dto.vehiclePlate && { vehicle_plate: dto.vehiclePlate }),
                updated_by: userEmail,
                updated_at: new Date(),
              },
            });
          }
        }

        if (existing.type === ShipmentType.SEA) {
          if (dto.portMaskUuid || dto.fleetNumber) {
            const port = dto.portMaskUuid
              ? await tx.port.findUnique({
                  where: { mask_uuid: dto.portMaskUuid },
                  select: { id: true },
                })
              : null;

            if (dto.portMaskUuid && !port) {
              throw new NotFoundException('Port not found');
            }

            await tx.sea_shipment.updateMany({
              where: { shipment_id: shipmentId },
              data: {
                ...(port && { port_id: port.id }),
                ...(dto.fleetNumber && { fleet_number: dto.fleetNumber }),
                updated_by: userEmail,
                updated_at: new Date(),
              },
            });
          }
        }

        // =========================
        // 7. RESPONSE SEGURO
        // =========================
        return tx.shipment.findUnique({
          where: { id: shipmentId },
          select: SHIPMENT_DETAIL_SELECT,
        });
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
