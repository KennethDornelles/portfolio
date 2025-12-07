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
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { PaginationDto } from '../../common/dto';

@ApiTags('Testimonials')
@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo depoimento' })
  @ApiResponse({ status: 201, description: 'Depoimento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialService.create(createTestimonialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os depoimentos' })
  @ApiResponse({ status: 200, description: 'Lista de depoimentos' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.testimonialService.findAll(paginationDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar depoimentos ativos' })
  @ApiResponse({ status: 200, description: 'Lista de depoimentos ativos' })
  findActive() {
    return this.testimonialService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar depoimento por ID' })
  @ApiParam({ name: 'id', description: 'ID do depoimento' })
  @ApiResponse({ status: 200, description: 'Depoimento encontrado' })
  @ApiResponse({ status: 404, description: 'Depoimento não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.testimonialService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar depoimento' })
  @ApiParam({ name: 'id', description: 'ID do depoimento' })
  @ApiResponse({ status: 200, description: 'Depoimento atualizado' })
  @ApiResponse({ status: 404, description: 'Depoimento não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ) {
    return this.testimonialService.update(id, updateTestimonialDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover depoimento' })
  @ApiParam({ name: 'id', description: 'ID do depoimento' })
  @ApiResponse({ status: 200, description: 'Depoimento removido' })
  @ApiResponse({ status: 404, description: 'Depoimento não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.testimonialService.remove(id);
  }
}
