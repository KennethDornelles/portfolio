import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Technologies')
@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all technologies' })
  @ApiResponse({ status: 200, description: 'Return all technologies.' })
  findAll() {
    return this.technologiesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new technology (Admin only)' })
  @ApiResponse({ status: 201, description: 'The technology has been successfully created.' })
  create(@Body() createTechnologyDto: CreateTechnologyDto) {
    return this.technologiesService.create(createTechnologyDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a technology (Admin only)' })
  @ApiResponse({ status: 200, description: 'The technology has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateTechnologyDto: UpdateTechnologyDto) {
    return this.technologiesService.update(id, updateTechnologyDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a technology (Admin only)' })
  @ApiResponse({ status: 200, description: 'The technology has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.technologiesService.remove(id);
  }
}
