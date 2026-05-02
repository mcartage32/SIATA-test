import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { UpdateProductDto } from './dtos/update-product.dto.js';
import { QueryProductDto } from './dtos/query-product.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';
import { PaginatedDto } from '../common/dtos/paginated-response.dto.js';
import {
  ProductResponseDto,
  ProductResponseSelectDto,
} from './dtos/product-response.dto.js';
import { MaskUuidParamDto } from '../common/dtos/maskUuid.dto.js';
import type { RequestWithUser } from '../interfaces/requestWithUser.interface.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @Post()
  create(@Body() dto: CreateProductDto, @Req() req: RequestWithUser) {
    return this.service.create(dto, req.user.email);
  }

  @ApiOperation({ summary: 'List products (paginated)' })
  @ApiResponse({ status: 200, type: PaginatedDto(ProductResponseDto) })
  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: 'Products for select' })
  @ApiResponse({ status: 200, type: [ProductResponseSelectDto] })
  @Get('select')
  findSelectOptions() {
    return this.service.findSelectOptions();
  }

  @ApiOperation({ summary: 'Get product by mask_uuid' })
  @ApiParam({
    name: 'maskUuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @Get(':maskUuid')
  findOne(@Param() { maskUuid }: MaskUuidParamDto) {
    return this.service.findByMaskUuid(maskUuid);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @Patch(':maskUuid')
  update(
    @Param() { maskUuid }: MaskUuidParamDto,
    @Body() dto: UpdateProductDto,
    @Req() req: RequestWithUser,
  ) {
    return this.service.update(maskUuid, dto, req.user.email);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200 })
  @Delete(':maskUuid')
  remove(@Param() { maskUuid }: MaskUuidParamDto) {
    return this.service.remove(maskUuid);
  }
}
