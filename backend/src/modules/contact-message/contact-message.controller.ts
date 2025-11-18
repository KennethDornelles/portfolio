import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ContactMessageService } from './contact-message.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { MessageStatus } from '@prisma/client';

@ApiTags('Contact Messages')
@Controller('contact-message')
export class ContactMessageController {
  constructor(private readonly contactMessageService: ContactMessageService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova mensagem de contato' })
  @ApiResponse({ status: 201, description: 'Mensagem criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createContactMessageDto: CreateContactMessageDto) {
    return this.contactMessageService.create(createContactMessageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as mensagens de contato' })
  @ApiQuery({ name: 'status', required: false, enum: MessageStatus, description: 'Filtrar por status' })
  @ApiResponse({ status: 200, description: 'Lista de mensagens' })
  findAll(@Query('status') status?: MessageStatus) {
    if (status) {
      return this.contactMessageService.findByStatus(status);
    }
    return this.contactMessageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar mensagem de contato por ID' })
  @ApiParam({ name: 'id', description: 'ID da mensagem' })
  @ApiResponse({ status: 200, description: 'Mensagem encontrada' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
  findOne(@Param('id') id: string) {
    return this.contactMessageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar mensagem de contato' })
  @ApiParam({ name: 'id', description: 'ID da mensagem' })
  @ApiResponse({ status: 200, description: 'Mensagem atualizada' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateContactMessageDto: UpdateContactMessageDto,
  ) {
    return this.contactMessageService.update(id, updateContactMessageDto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar mensagem como lida' })
  @ApiParam({ name: 'id', description: 'ID da mensagem' })
  @ApiResponse({ status: 200, description: 'Mensagem marcada como lida' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
  markAsRead(@Param('id') id: string) {
    return this.contactMessageService.markAsRead(id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Arquivar mensagem' })
  @ApiParam({ name: 'id', description: 'ID da mensagem' })
  @ApiResponse({ status: 200, description: 'Mensagem arquivada' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
  markAsArchived(@Param('id') id: string) {
    return this.contactMessageService.markAsArchived(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover mensagem de contato' })
  @ApiParam({ name: 'id', description: 'ID da mensagem' })
  @ApiResponse({ status: 200, description: 'Mensagem removida' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
  remove(@Param('id') id: string) {
    return this.contactMessageService.remove(id);
  }
}
