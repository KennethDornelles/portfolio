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
import { Public } from '../../decorators';
import { CodeExampleService } from './code-example.service';
import { CreateCodeExampleDto } from './dto/create-code-example.dto';
import { UpdateCodeExampleDto } from './dto/update-code-example.dto';
import { PaginationDto } from '../../common/dto';

@ApiTags('Code Examples')
@Controller('code-example')
export class CodeExampleController {
  constructor(private readonly codeExampleService: CodeExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo exemplo de código' })
  @ApiResponse({ status: 201, description: 'Exemplo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createCodeExampleDto: CreateCodeExampleDto) {
    return this.codeExampleService.create(createCodeExampleDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todos os exemplos de código' })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Filtrar por linguagem',
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
  @ApiResponse({ status: 200, description: 'Lista de exemplos' })
  findAll(
    @Query('language') language?: string,
    @Query() paginationDto?: PaginationDto,
  ) {
    if (language) {
      return this.codeExampleService.findByLanguage(language);
    }
    return this.codeExampleService.findAll(paginationDto);
  }

  @Get('active')
  @Public()
  @ApiOperation({ summary: 'Listar exemplos de código ativos' })
  @ApiResponse({ status: 200, description: 'Lista de exemplos ativos' })
  findActive() {
    return this.codeExampleService.findActive();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar exemplo de código por ID' })
  @ApiParam({ name: 'id', description: 'ID do exemplo' })
  @ApiResponse({ status: 200, description: 'Exemplo encontrado' })
  @ApiResponse({ status: 404, description: 'Exemplo não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.codeExampleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar exemplo de código' })
  @ApiParam({ name: 'id', description: 'ID do exemplo' })
  @ApiResponse({ status: 200, description: 'Exemplo atualizado' })
  @ApiResponse({ status: 404, description: 'Exemplo não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCodeExampleDto: UpdateCodeExampleDto,
  ) {
    return this.codeExampleService.update(id, updateCodeExampleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover exemplo de código' })
  @ApiParam({ name: 'id', description: 'ID do exemplo' })
  @ApiResponse({ status: 200, description: 'Exemplo removido' })
  @ApiResponse({ status: 404, description: 'Exemplo não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.codeExampleService.remove(id);
  }
}
