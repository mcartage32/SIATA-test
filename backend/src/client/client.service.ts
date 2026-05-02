import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClientDto } from './dtos/create-client.dto.js';
import { QueryClientDto } from './dtos/query-client.dto.js';
import { UpdateClientDto } from './dtos/update-client.dto.js';
import { CLIENT_SELECT } from './constants/client.select.js';
import { handlePrismaError } from '../common/errors/prisma-error.handler.js';
import { getPagination } from '../common/utils/pagination.util.js';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto, userEmail: string) {
    try {
      return await this.prisma.client.create({
        data: {
          ...dto,
          created_by: userEmail,
        },
        select: CLIENT_SELECT,
      });
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async findAll(query: QueryClientDto) {
    const { page, limit, skip } = getPagination(query);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: CLIENT_SELECT,
      }),
      this.prisma.client.count(),
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

  async findSelectOptions() {
    return this.prisma.client.findMany({
      select: {
        mask_uuid: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByMaskUuid(maskUuid: string) {
    const client = await this.prisma.client.findUnique({
      where: { mask_uuid: maskUuid },
      select: CLIENT_SELECT,
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  // Obtener solo el id relacional
  async getIdByMaskUuid(maskUuid: string) {
    const client = await this.prisma.client.findUnique({
      where: { mask_uuid: maskUuid },
      select: { id: true },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client.id;
  }

  async update(maskUuid: string, dto: UpdateClientDto, userEmail: string) {
    try {
      return await this.prisma.client.update({
        where: { mask_uuid: maskUuid },
        data: {
          ...dto,
          updated_by: userEmail,
          updated_at: new Date(),
        },
        select: CLIENT_SELECT,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(maskUuid: string): Promise<{ message: string }> {
    try {
      await this.prisma.client.delete({
        where: { mask_uuid: maskUuid },
      });

      return { message: 'Client deleted successfully' };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
