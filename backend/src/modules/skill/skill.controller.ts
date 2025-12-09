import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillCategory } from '@prisma/client';
import { PaginationDto } from '../../common/dto';

@ApiTags('Skills')
@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova habilidade' })
  @ApiResponse({ status: 201, description: 'Habilidade criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as habilidades' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: SkillCategory,
    description: 'Filtrar por categoria',
  })
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
  @ApiResponse({ status: 200, description: 'Lista de habilidades' })
  findAll(
    @Query('category') category?: SkillCategory,
    @Query() paginationDto?: PaginationDto,
  ) {
    if (category) {
      return this.skillService.findByCategory(category);
    }
    return this.skillService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar habilidade por ID' })
  @ApiParam({ name: 'id', description: 'ID da habilidade' })
  @ApiResponse({ status: 200, description: 'Habilidade encontrada' })
  @ApiResponse({ status: 404, description: 'Habilidade não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.skillService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar habilidade' })
  @ApiParam({ name: 'id', description: 'ID da habilidade' })
  @ApiResponse({ status: 200, description: 'Habilidade atualizada' })
  @ApiResponse({ status: 404, description: 'Habilidade não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return this.skillService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover habilidade' })
  @ApiParam({ name: 'id', description: 'ID da habilidade' })
  @ApiResponse({ status: 200, description: 'Habilidade removida' })
  @ApiResponse({ status: 404, description: 'Habilidade não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.skillService.remove(id);
  }
}
