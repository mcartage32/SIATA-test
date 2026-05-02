import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { UpdateProductDto } from './dtos/update-product.dto.js';
import { QueryProductDto } from './dtos/query-product.dto.js';
import { PRODUCT_SELECT } from './constants/product.select.js';
import { handlePrismaError } from '../common/errors/prisma-error.handler.js';
import { getPagination } from '../common/utils/pagination.util.js';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, userEmail: string) {
    try {
      return await this.prisma.product.create({
        data: {
          ...dto,
          created_by: userEmail,
        },
        select: PRODUCT_SELECT,
      });
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async findAll(query: QueryProductDto) {
    const { page, limit, skip } = getPagination(query);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: PRODUCT_SELECT,
      }),
      this.prisma.product.count(),
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
    return this.prisma.product.findMany({
      select: {
        mask_uuid: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByMaskUuid(maskUuid: string) {
    const product = await this.prisma.product.findUnique({
      where: { mask_uuid: maskUuid },
      select: PRODUCT_SELECT,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getIdByMaskUuid(maskUuid: string) {
    const product = await this.prisma.product.findUnique({
      where: { mask_uuid: maskUuid },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product.id;
  }

  async update(maskUuid: string, dto: UpdateProductDto, userEmail: string) {
    try {
      return await this.prisma.product.update({
        where: { mask_uuid: maskUuid },
        data: {
          ...dto,
          updated_by: userEmail,
          updated_at: new Date(),
        },
        select: PRODUCT_SELECT,
      });
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async remove(maskUuid: string) {
    try {
      await this.prisma.product.delete({
        where: { mask_uuid: maskUuid },
      });

      return { message: 'Product deleted successfully' };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
