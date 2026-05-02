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
import { WarehouseService } from './warehouse.service.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { CreateWarehouseDto } from './dtos/create-warehouse.dto.js';
import { UpdateWarehouseDto } from './dtos/update-warehouse.dto.js';
import { QueryWarehouseDto } from './dtos/query-warehouse.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';
import { PaginatedDto } from '../common/dtos/paginated-response.dto.js';
import {
  WarehouseResponseDto,
  WarehouseResponseSelectDto,
} from './dtos/warehouse-response.dto.js';
import { MaskUuidParamDto } from '../common/dtos/maskUuid.dto.js';
import type { RequestWithUser } from '../interfaces/requestWithUser.interface.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  @ApiOperation({ summary: 'Create warehouse' })
  @ApiResponse({ status: 201, type: WarehouseResponseDto })
  @Post()
  create(@Body() dto: CreateWarehouseDto, @Req() req: RequestWithUser) {
    return this.service.create(dto, req.user.email);
  }

  @ApiOperation({ summary: 'List warehouses (paginated)' })
  @ApiResponse({ status: 200, type: PaginatedDto(WarehouseResponseDto) })
  @Get()
  findAll(@Query() query: QueryWarehouseDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: 'Warehouses for select' })
  @ApiResponse({ status: 200, type: [WarehouseResponseSelectDto] })
  @Get('select')
  findSelectOptions() {
    return this.service.findSelectOptions();
  }

  @ApiOperation({ summary: 'Get warehouse by mask_uuid' })
  @ApiParam({
    name: 'maskUuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, type: WarehouseResponseDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':maskUuid')
  findOne(@Param() { maskUuid }: MaskUuidParamDto) {
    return this.service.findByMaskUuid(maskUuid);
  }

  @ApiOperation({ summary: 'Update warehouse' })
  @ApiResponse({ status: 200, type: WarehouseResponseDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Patch(':maskUuid')
  update(
    @Param() { maskUuid }: MaskUuidParamDto,
    @Body() dto: UpdateWarehouseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.service.update(maskUuid, dto, req.user.email);
  }

  @ApiOperation({ summary: 'Delete warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse deleted successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Delete(':maskUuid')
  remove(@Param() { maskUuid }: MaskUuidParamDto) {
    return this.service.remove(maskUuid);
  }
}
