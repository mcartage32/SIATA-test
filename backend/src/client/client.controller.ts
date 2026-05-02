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
import { ClientService } from './client.service.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { CreateClientDto } from './dtos/create-client.dto.js';
import { QueryClientDto } from './dtos/query-client.dto.js';
import { UpdateClientDto } from './dtos/update-client.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';
import { PaginatedDto } from '../common/dtos/paginated-response.dto.js';
import {
  ClientResponseDto,
  ClientResponseSelectDto,
} from './dtos/client-response.dto.js';
import { MaskUuidParamDto } from '../common/dtos/maskUuid.dto.js';
import type { RequestWithUser } from '../interfaces/requestWithUser.interface.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly service: ClientService) {}

  @ApiOperation({ summary: 'Create client' })
  @ApiResponse({ status: 201, type: ClientResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  create(@Body() dto: CreateClientDto, @Req() req: RequestWithUser) {
    return this.service.create(dto, req.user.email);
  }

  @ApiOperation({ summary: 'List clients (paginated)' })
  @ApiResponse({ status: 200, type: PaginatedDto(ClientResponseDto) })
  @Get()
  findAll(@Query() query: QueryClientDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: 'Clients for select (without pagination)' })
  @ApiResponse({ status: 200, type: [ClientResponseSelectDto] })
  @Get('select')
  findSelectOptions() {
    return this.service.findSelectOptions();
  }

  @ApiOperation({ summary: 'Get client by mask_uuid' })
  @ApiParam({ name: 'maskUuid', example: 'abc123xyz' })
  @ApiResponse({ status: 200, type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':maskUuid')
  findOne(@Param() { maskUuid }: MaskUuidParamDto) {
    return this.service.findByMaskUuid(maskUuid);
  }

  @ApiOperation({ summary: 'Update client' })
  @ApiParam({ name: 'maskUuid' })
  @ApiResponse({ status: 200, type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Patch(':maskUuid')
  update(
    @Param() { maskUuid }: MaskUuidParamDto,
    @Body() dto: UpdateClientDto,
    @Req() req: RequestWithUser,
  ) {
    return this.service.update(maskUuid, dto, req.user.email);
  }

  @ApiOperation({ summary: 'Delete client' })
  @ApiParam({ name: 'maskUuid' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Delete(':maskUuid')
  remove(@Param() { maskUuid }: MaskUuidParamDto) {
    return this.service.remove(maskUuid);
  }
}
