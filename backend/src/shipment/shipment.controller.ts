import {
  Body,
  Controller,
  Post,
  Query,
  Req,
  UseGuards,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ShipmentService } from './shipment.service.js';
import { CreateShipmentDto } from './dtos/create-shipment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';
import type { RequestWithUser } from '../interfaces/requestWithUser.interface.js';
import { ShipmentResponseDto } from './dtos/shipment-response.dto.js';
import { PaginatedDto } from '../common/dtos/paginated-response.dto.js';
import { QueryShipmentDto } from './dtos/query-shipment.dto.js';
import { MaskUuidParamDto } from '../common/dtos/maskUuid.dto.js';
import { UpdateShipmentDto } from './dtos/update-shipment.dto.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Shipments')
@Controller('shipments')
export class ShipmentController {
  constructor(private readonly service: ShipmentService) {}

  @ApiOperation({ summary: 'Create shipment (land or sea)' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 201, type: ShipmentResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({
    status: 404,
    description: 'Client/Product/Warehouse/Port not found',
  })
  @Post()
  create(@Body() dto: CreateShipmentDto, @Req() req: RequestWithUser) {
    return this.service.create(dto, req.user.email);
  }

  @ApiOperation({ summary: 'List shipments (paginated)' })
  @ApiResponse({ status: 200, type: PaginatedDto(ShipmentResponseDto) })
  @Get()
  findAll(@Query() query: QueryShipmentDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: 'Get shipment by mask_uuid' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':maskUuid')
  findOne(@Param() { maskUuid }: MaskUuidParamDto) {
    return this.service.findOne(maskUuid);
  }

  @ApiOperation({ summary: 'Delete shipment' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Delete(':maskUuid')
  remove(@Param() { maskUuid }: MaskUuidParamDto) {
    return this.service.remove(maskUuid);
  }

  @ApiOperation({ summary: 'Update shipment' })
  @ApiParam({
    name: 'maskUuid',
    description: 'Masked UUID of the shipment',
    example: '4122aae9-f467-45cc-860b-898111a91333',
  })
  @ApiResponse({
    status: 200,
    description: 'Shipment updated successfully',
    type: ShipmentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  @Patch(':maskUuid')
  update(
    @Param() { maskUuid }: MaskUuidParamDto,
    @Body() dto: UpdateShipmentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.service.update(maskUuid, dto, req.user.email);
  }
}
