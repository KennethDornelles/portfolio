import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PersonalInfoService } from './personal-info.service';
import { CreatePersonalInfoDto } from './dto/create-personal-info.dto';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';

@ApiTags('Personal Info')
@Controller('personal-info')
export class PersonalInfoController {
  constructor(private readonly personalInfoService: PersonalInfoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova informação pessoal' })
  @ApiResponse({
    status: 201,
    description: 'Informação pessoal criada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createPersonalInfoDto: CreatePersonalInfoDto) {
    return this.personalInfoService.create(createPersonalInfoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as informações pessoais' })
  @ApiResponse({ status: 200, description: 'Lista de informações pessoais' })
  findAll() {
    return this.personalInfoService.findAll();
  }

  @Get('current')
  @ApiOperation({ summary: 'Buscar informação pessoal atual' })
  @ApiResponse({ status: 200, description: 'Informação pessoal atual' })
  @ApiResponse({ status: 404, description: 'Informação não encontrada' })
  findCurrent() {
    return this.personalInfoService.findCurrent();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar informação pessoal por ID' })
  @ApiParam({ name: 'id', description: 'ID da informação pessoal' })
  @ApiResponse({ status: 200, description: 'Informação pessoal encontrada' })
  @ApiResponse({ status: 404, description: 'Informação não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.personalInfoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar informação pessoal' })
  @ApiParam({ name: 'id', description: 'ID da informação pessoal' })
  @ApiResponse({ status: 200, description: 'Informação pessoal atualizada' })
  @ApiResponse({ status: 404, description: 'Informação não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePersonalInfoDto: UpdatePersonalInfoDto,
  ) {
    return this.personalInfoService.update(id, updatePersonalInfoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover informação pessoal' })
  @ApiParam({ name: 'id', description: 'ID da informação pessoal' })
  @ApiResponse({ status: 204, description: 'Informação pessoal removida' })
  @ApiResponse({ status: 404, description: 'Informação não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.personalInfoService.remove(id);
  }
}
