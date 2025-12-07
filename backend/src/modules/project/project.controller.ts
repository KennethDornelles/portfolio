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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from '../../common/dto';
import { Public } from '../../decorators';

@ApiTags('Projects')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Criar novo projeto' })
  @ApiResponse({ status: 201, description: 'Projeto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todos os projetos' })
  @ApiResponse({ status: 200, description: 'Lista de projetos' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.projectService.findAll(paginationDto);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Listar projetos em destaque' })
  @ApiResponse({ status: 200, description: 'Lista de projetos em destaque' })
  findFeatured() {
    return this.projectService.findFeatured();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar projeto por ID' })
  @ApiParam({ name: 'id', description: 'ID do projeto' })
  @ApiResponse({ status: 200, description: 'Projeto encontrado' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Atualizar projeto' })
  @ApiParam({ name: 'id', description: 'ID do projeto' })
  @ApiResponse({ status: 200, description: 'Projeto atualizado' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Remover projeto' })
  @ApiParam({ name: 'id', description: 'ID do projeto' })
  @ApiResponse({ status: 200, description: 'Projeto removido' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.remove(id);
  }
}
