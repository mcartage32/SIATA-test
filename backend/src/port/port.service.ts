import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePortDto } from './dtos/create-port.dto.js';
import { UpdatePortDto } from './dtos/update-port.dto.js';
import { QueryPortDto } from './dtos/query-port.dto.js';
import { PORT_SELECT } from './constants/port.select.js';
import { handlePrismaError } from '../common/errors/prisma-error.handler.js';
import { getPagination } from '../common/utils/pagination.util.js';
import { assertNotUsedInShipments } from '../common/utils/relation-checker.util.js';

@Injectable()
export class PortService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePortDto, userEmail: string) {
    try {
      return await this.prisma.port.create({
        data: {
          ...dto,
          created_by: userEmail,
        },
        select: PORT_SELECT,
      });
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async findAll(query: QueryPortDto) {
    const { page, limit, skip } = getPagination(query);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.port.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: PORT_SELECT,
      }),
      this.prisma.port.count(),
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
    return this.prisma.port.findMany({
      select: {
        mask_uuid: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByMaskUuid(maskUuid: string) {
    const port = await this.prisma.port.findUnique({
      where: { mask_uuid: maskUuid },
      select: PORT_SELECT,
    });

    if (!port) {
      throw new NotFoundException('Port not found');
    }

    return port;
  }

  async getIdByMaskUuid(maskUuid: string) {
    const port = await this.prisma.port.findUnique({
      where: { mask_uuid: maskUuid },
      select: { id: true },
    });

    if (!port) {
      throw new NotFoundException('Port not found');
    }

    return port.id;
  }

  async update(maskUuid: string, dto: UpdatePortDto, userEmail: string) {
    try {
      return await this.prisma.port.update({
        where: { mask_uuid: maskUuid },
        data: {
          ...dto,
          updated_by: userEmail,
          updated_at: new Date(),
        },
        select: PORT_SELECT,
      });
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async remove(maskUuid: string): Promise<{ message: string }> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const port = await tx.port.findUnique({
          where: { mask_uuid: maskUuid },
          select: { id: true },
        });

        if (!port) {
          throw new NotFoundException('Port not found');
        }

        await assertNotUsedInShipments(tx, {
          sea_shipment: {
            is: {
              port_id: port.id,
            },
          },
        });

        await tx.port.delete({
          where: { id: port.id },
        });

        return { message: 'Port deleted successfully' };
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
