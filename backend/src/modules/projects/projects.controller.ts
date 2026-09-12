import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

import { Public } from '../../common/decorators/public.decorator';
import { ProjectPaginationDto } from './dto/project-pagination.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new project (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
  })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Public()
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120000) // 2 minutes cache
  @ApiOperation({ summary: 'List all projects (Cached)' })
  @ApiResponse({ status: 200, description: 'Return all projects.' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Public()
  @Get('page')
  @ApiOperation({ summary: 'List projects with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Return a paginated project list.' })
  findPage(@Query() pagination: ProjectPaginationDto) {
    return this.projectsService.findPage(pagination.page, pagination.limit);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiResponse({ status: 200, description: 'Return a single project.' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a project by slug' })
  @ApiResponse({ status: 200, description: 'Return a single project by slug.' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a project (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully updated.',
  })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
