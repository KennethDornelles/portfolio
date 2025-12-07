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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { ContactMessageService } from './contact-message.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { MessageStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto';
import { Public } from '../../decorators';

@ApiTags('Contact Messages')
@Controller('contact-message')
export class ContactMessageController {
  constructor(private readonly contactMessageService: ContactMessageService) {}

  @Post()
  @Public()
  @ApiOperation({
    summary: 'Criar nova mensagem de contato',
    description:
      'Endpoint público para envio de mensagens de contato pelo formulário do portfólio',
  })
  @ApiResponse({ status: 201, description: 'Mensagem criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createContactMessageDto: CreateContactMessageDto) {
    return this.contactMessageService.create(createContactMessageDto);
  }

  @Get()
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Listar todas as mensagens de contato' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: MessageStatus,
    description: 'Filtrar por status',
  })
  @ApiResponse({ status: 200, description: 'Lista de mensagens' })
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  findAll(
    @Query('status') status?: MessageStatus,
    @Query() paginationDto?: PaginationDto,
  ) {
    if (status) {
      return this.contactMessageService.findByStatus(status);
    }
    return this.contactMessageService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Buscar mensagem de contato por ID' })
  @ApiParam({ name: 'id', description: 'ID da mensagem' })
  @ApiResponse({ status: 200, description: 'Mensagem encontrada' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  findOne(@Param('id') id: string) {
    return this.contactMessageService.findOne(id);
  }

  @Patch(':id')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Atualizar mensagem de contato' })
  @ApiParam({ name: 'id', description: 'ID da mensagem' })
  @ApiResponse({ status: 200, description: 'Mensagem atualizada' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  update(
    @Param('id') id: string,
    @Body() updateContactMessageDto: UpdateContactMessageDto,
  ) {
    return this.contactMessageService.update(id, updateContactMessageDto);
  }

  @Patch(':id/read')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Marcar mensagem como lida' })
  @ApiParam({ name: 'id', description: 'ID da mensagem' })
  @ApiResponse({ status: 200, description: 'Mensagem marcada como lida' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  markAsRead(@Param('id') id: string) {
    return this.contactMessageService.markAsRead(id);
  }

  @Patch(':id/archive')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Arquivar mensagem' })
  @ApiParam({ name: 'id', description: 'ID da mensagem' })
  @ApiResponse({ status: 200, description: 'Mensagem arquivada' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  markAsArchived(@Param('id') id: string) {
    return this.contactMessageService.markAsArchived(id);
  }

  @Delete(':id')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Remover mensagem de contato' })
  @ApiParam({ name: 'id', description: 'ID da mensagem' })
  @ApiResponse({ status: 200, description: 'Mensagem removida' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  remove(@Param('id') id: string) {
    return this.contactMessageService.remove(id);
  }
}
