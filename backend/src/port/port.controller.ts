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
import { PortService } from './port.service.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { CreatePortDto } from './dtos/create-port.dto.js';
import { UpdatePortDto } from './dtos/update-port.dto.js';
import { QueryPortDto } from './dtos/query-port.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';
import { PaginatedDto } from '../common/dtos/paginated-response.dto.js';
import {
  PortResponseDto,
  PortResponseSelectDto,
} from './dtos/port-response.dto.js';
import { MaskUuidParamDto } from '../common/dtos/maskUuid.dto.js';
import type { RequestWithUser } from '../interfaces/requestWithUser.interface.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Ports')
@Controller('ports')
export class PortController {
  constructor(private readonly service: PortService) {}

  @ApiOperation({ summary: 'Create port' })
  @ApiResponse({ status: 201, type: PortResponseDto })
  @Post()
  create(@Body() dto: CreatePortDto, @Req() req: RequestWithUser) {
    return this.service.create(dto, req.user.email);
  }

  @ApiOperation({ summary: 'List ports (paginated)' })
  @ApiResponse({ status: 200, type: PaginatedDto(PortResponseDto) })
  @Get()
  findAll(@Query() query: QueryPortDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: 'Ports for select' })
  @ApiResponse({ status: 200, type: [PortResponseSelectDto] })
  @Get('select')
  findSelectOptions() {
    return this.service.findSelectOptions();
  }

  @ApiOperation({ summary: 'Get port by mask_uuid' })
  @ApiParam({
    name: 'maskUuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, type: PortResponseDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':maskUuid')
  findOne(@Param() { maskUuid }: MaskUuidParamDto) {
    return this.service.findByMaskUuid(maskUuid);
  }

  @ApiOperation({ summary: 'Update port' })
  @ApiResponse({ status: 200, type: PortResponseDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Patch(':maskUuid')
  update(
    @Param() { maskUuid }: MaskUuidParamDto,
    @Body() dto: UpdatePortDto,
    @Req() req: RequestWithUser,
  ) {
    return this.service.update(maskUuid, dto, req.user.email);
  }

  @ApiOperation({ summary: 'Delete port' })
  @ApiResponse({ status: 200, description: 'Port deleted successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Delete(':maskUuid')
  remove(@Param() { maskUuid }: MaskUuidParamDto) {
    return this.service.remove(maskUuid);
  }
}
