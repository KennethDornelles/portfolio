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
import { SocialLinkService } from './social-link.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';

@ApiTags('Social Links')
@Controller('social-link')
export class SocialLinkController {
  constructor(private readonly socialLinkService: SocialLinkService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo link de rede social' })
  @ApiResponse({ status: 201, description: 'Link criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createSocialLinkDto: CreateSocialLinkDto) {
    return this.socialLinkService.create(createSocialLinkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os links de redes sociais' })
  @ApiResponse({ status: 200, description: 'Lista de links' })
  findAll() {
    return this.socialLinkService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar links de redes sociais ativos' })
  @ApiResponse({ status: 200, description: 'Lista de links ativos' })
  findActive() {
    return this.socialLinkService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar link de rede social por ID' })
  @ApiParam({ name: 'id', description: 'ID do link' })
  @ApiResponse({ status: 200, description: 'Link encontrado' })
  @ApiResponse({ status: 404, description: 'Link não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.socialLinkService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar link de rede social' })
  @ApiParam({ name: 'id', description: 'ID do link' })
  @ApiResponse({ status: 200, description: 'Link atualizado' })
  @ApiResponse({ status: 404, description: 'Link não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSocialLinkDto: UpdateSocialLinkDto,
  ) {
    return this.socialLinkService.update(id, updateSocialLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover link de rede social' })
  @ApiParam({ name: 'id', description: 'ID do link' })
  @ApiResponse({ status: 200, description: 'Link removido' })
  @ApiResponse({ status: 404, description: 'Link não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.socialLinkService.remove(id);
  }
}
