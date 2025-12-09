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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { PaginationDto } from '../../common/dto';

@ApiTags('Experience')
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova experiência profissional' })
  @ApiResponse({ status: 201, description: 'Experiência criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.create(createExperienceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as experiências profissionais' })
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
  @ApiResponse({ status: 200, description: 'Lista de experiências' })
  findAll(@Query() paginationDto?: PaginationDto) {
    return this.experienceService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar experiência por ID' })
  @ApiParam({ name: 'id', description: 'ID da experiência' })
  @ApiResponse({ status: 200, description: 'Experiência encontrada' })
  @ApiResponse({ status: 404, description: 'Experiência não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.experienceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar experiência profissional' })
  @ApiParam({ name: 'id', description: 'ID da experiência' })
  @ApiResponse({ status: 200, description: 'Experiência atualizada' })
  @ApiResponse({ status: 404, description: 'Experiência não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experienceService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover experiência profissional' })
  @ApiParam({ name: 'id', description: 'ID da experiência' })
  @ApiResponse({ status: 200, description: 'Experiência removida' })
  @ApiResponse({ status: 404, description: 'Experiência não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.experienceService.remove(id);
  }
}
