import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Public } from '../../decorators';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../../common/dto';

@ApiTags('Services')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo serviço' })
  @ApiResponse({ status: 201, description: 'Serviço criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todos os serviços' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por página',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Lista de serviços' })
  findAll(@Query() paginationDto?: PaginationDto) {
    return this.serviceService.findAll(paginationDto);
  }

  @Get('active')
  @Public()
  @ApiOperation({ summary: 'Listar serviços ativos' })
  @ApiResponse({ status: 200, description: 'Lista de serviços ativos' })
  findActive() {
    return this.serviceService.findActive();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar serviço por ID' })
  @ApiParam({ name: 'id', description: 'ID do serviço' })
  @ApiResponse({ status: 200, description: 'Serviço encontrado' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar serviço' })
  @ApiParam({ name: 'id', description: 'ID do serviço' })
  @ApiResponse({ status: 200, description: 'Serviço atualizado' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover serviço' })
  @ApiParam({ name: 'id', description: 'ID do serviço' })
  @ApiResponse({ status: 200, description: 'Serviço removido' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.remove(id);
  }
}
