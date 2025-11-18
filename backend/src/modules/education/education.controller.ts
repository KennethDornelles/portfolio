import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@ApiTags('Education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova formação acadêmica' })
  @ApiResponse({ status: 201, description: 'Formação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createEducationDto: CreateEducationDto) {
    return this.educationService.create(createEducationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as formações acadêmicas' })
  @ApiResponse({ status: 200, description: 'Lista de formações' })
  findAll() {
    return this.educationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar formação por ID' })
  @ApiParam({ name: 'id', description: 'ID da formação' })
  @ApiResponse({ status: 200, description: 'Formação encontrada' })
  @ApiResponse({ status: 404, description: 'Formação não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.educationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar formação acadêmica' })
  @ApiParam({ name: 'id', description: 'ID da formação' })
  @ApiResponse({ status: 200, description: 'Formação atualizada' })
  @ApiResponse({ status: 404, description: 'Formação não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.educationService.update(id, updateEducationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover formação acadêmica' })
  @ApiParam({ name: 'id', description: 'ID da formação' })
  @ApiResponse({ status: 200, description: 'Formação removida' })
  @ApiResponse({ status: 404, description: 'Formação não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.educationService.remove(id);
  }
}
