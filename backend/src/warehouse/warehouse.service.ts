import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateWarehouseDto } from './dtos/create-warehouse.dto.js';
import { UpdateWarehouseDto } from './dtos/update-warehouse.dto.js';
import { QueryWarehouseDto } from './dtos/query-warehouse.dto.js';
import { WAREHOUSE_SELECT } from './constants/warehouse.select.js';
import { handlePrismaError } from '../common/errors/prisma-error.handler.js';
import { getPagination } from '../common/utils/pagination.util.js';
import { assertNotUsedInShipments } from '../common/utils/relation-checker.util.js';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWarehouseDto, userEmail: string) {
    try {
      return await this.prisma.warehouse.create({
        data: {
          ...dto,
          created_by: userEmail,
        },
        select: WAREHOUSE_SELECT,
      });
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async findAll(query: QueryWarehouseDto) {
    const { page, limit, skip } = getPagination(query);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.warehouse.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: WAREHOUSE_SELECT,
      }),
      this.prisma.warehouse.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findSelectOptions() {
    return this.prisma.warehouse.findMany({
      select: {
        mask_uuid: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByMaskUuid(maskUuid: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { mask_uuid: maskUuid },
      select: WAREHOUSE_SELECT,
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async getIdByMaskUuid(maskUuid: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { mask_uuid: maskUuid },
      select: { id: true },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse.id;
  }

  async update(maskUuid: string, dto: UpdateWarehouseDto, userEmail: string) {
    try {
      return await this.prisma.warehouse.update({
        where: { mask_uuid: maskUuid },
        data: {
          ...dto,
          updated_by: userEmail,
          updated_at: new Date(),
        },
        select: WAREHOUSE_SELECT,
      });
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async remove(maskUuid: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const warehouse = await tx.warehouse.findUnique({
          where: { mask_uuid: maskUuid },
          select: { id: true },
        });

        if (!warehouse) {
          throw new NotFoundException('Warehouse not found');
        }

        await assertNotUsedInShipments(tx, {
          land_shipment: {
            is: {
              warehouse_id: warehouse.id,
            },
          },
        });

        await tx.warehouse.delete({
          where: { id: warehouse.id },
        });

        return { message: 'Warehouse deleted successfully' };
      });
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
