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
import { getPagination } from '../common/utils/pagination.util.js';
import { QueryShipmentDto } from './dtos/query-shipment.dto.js';
import { UpdateShipmentDto } from './dtos/update-shipment.dto.js';
import { ShipmentDomain } from './domain/shipment.domain.js';
import { ShipmentItemsService } from './domain/shipment-items.service.js';
import { ShipmentPricingService } from './domain/shipment-pricing.service.js';

@Injectable()
export class ShipmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shipmentItemsService: ShipmentItemsService,
    private readonly shipmentPricingService: ShipmentPricingService,
  ) {}

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
        // VALIDATIONS
        // =========================
        ShipmentDomain.validateCreationInput(dto);
        ShipmentDomain.validateTypeSpecific(dto);

        const deliveryDate = validateFutureDate(dto.deliveryDate);

        const client = await tx.client.findUnique({
          where: { mask_uuid: dto.clientMaskUuid },
          select: { id: true },
        });

        if (!client) throw new NotFoundException('Client not found');

        // =========================
        // PRODUCTS
        // =========================
        const products = await this.shipmentItemsService.getValidatedProducts(
          tx,
          dto.items,
        );

        const itemsData = this.shipmentItemsService.buildItems(
          products,
          dto.items,
        );

        // =========================
        // PRICING
        // =========================
        const pricing = this.shipmentPricingService.calculatePricing(
          dto.type,
          dto.items,
          products,
        );

        // =========================
        // CREATE SHIPMENT
        // =========================
        const shipment = await tx.shipment.create({
          data: {
            type: dto.type,
            client_id: client.id,
            base_price: pricing.basePrice,
            discount_percent: pricing.discountPercent,
            discount_amount: pricing.discountAmount,
            total_price: pricing.totalPrice,
            guide_number: await this.generateUniqueGuideNumber(tx),
            created_by: userEmail,
            delivery_date: deliveryDate,
          },
          select: {
            id: true,
            ...SHIPMENT_DETAIL_SELECT,
          },
        });

        await tx.shipment_item.createMany({
          data: itemsData.map((item) => ({
            ...item,
            shipment_id: shipment.id,
          })),
        });

        if (dto.type === ShipmentType.LAND) {
          const warehouse = await tx.warehouse.findUnique({
            where: { mask_uuid: dto.warehouseMaskUuid! },
            select: { id: true },
          });

          if (!warehouse) throw new NotFoundException('Warehouse not found');

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

          if (!port) throw new NotFoundException('Port not found');

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
        // 2. VALIDACIONES FECHA
        // =========================
        let deliveryDate: Date | undefined;

        if (dto.deliveryDate) {
          deliveryDate = validateFutureDate(dto.deliveryDate);
        }

        // =========================
        // 3. VALIDACIONES POR TIPO
        // =========================
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
        // 4. UPDATE BASE OBJECT
        // =========================
        const updateData: Prisma.shipmentUpdateInput = {
          updated_by: userEmail,
          updated_at: new Date(),
        };

        if (deliveryDate) {
          updateData.delivery_date = deliveryDate;
        }

        // =========================
        // 5. ITEMS
        // =========================
        if (dto.items?.length) {
          // 5.1 Productos validados
          const productsRaw =
            await this.shipmentItemsService.getValidatedProducts(tx, dto.items);

          const products = productsRaw.map((p) => ({
            id: p.id,
            mask_uuid: p.mask_uuid,
            price: Number(p.price), // FIX Decimal → number
          }));

          // Items listos
          const itemsData = this.shipmentItemsService.buildItems(
            products,
            dto.items,
          );

          // Pricing
          const pricing = this.shipmentPricingService.calculatePricing(
            existing.type as ShipmentType,
            dto.items,
            products,
          );

          Object.assign(updateData, {
            base_price: pricing.basePrice,
            discount_percent: pricing.discountPercent,
            discount_amount: pricing.discountAmount,
            total_price: pricing.totalPrice,
          });

          // Reemplazar items (eliminar y crear)
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
        // 6. UPDATE SHIPMENT
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
        // 7. Terrerstre (cambiar bodega o placa de vehiculo)
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
                ...(dto.vehiclePlate && {
                  vehicle_plate: dto.vehiclePlate,
                }),
                updated_by: userEmail,
                updated_at: new Date(),
              },
            });
          }
        }

        // =========================
        // 8. Maritimo (cambiar puerto o flota)
        // =========================
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
                ...(dto.fleetNumber && {
                  fleet_number: dto.fleetNumber,
                }),
                updated_by: userEmail,
                updated_at: new Date(),
              },
            });
          }
        }

        // =========================
        // 9. RESPONSE FINAL
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
