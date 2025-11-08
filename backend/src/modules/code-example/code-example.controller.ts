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
import { CodeExampleService } from './code-example.service';
import { CreateCodeExampleDto } from './dto/create-code-example.dto';
import { UpdateCodeExampleDto } from './dto/update-code-example.dto';

@Controller('code-example')
export class CodeExampleController {
  constructor(private readonly codeExampleService: CodeExampleService) {}

  @Post()
  create(@Body() createCodeExampleDto: CreateCodeExampleDto) {
    return this.codeExampleService.create(createCodeExampleDto);
  }

  @Get()
  findAll(@Query('language') language?: string) {
    if (language) {
      return this.codeExampleService.findByLanguage(language);
    }
    return this.codeExampleService.findAll();
  }

  @Get('active')
  findActive() {
    return this.codeExampleService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codeExampleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCodeExampleDto: UpdateCodeExampleDto,
  ) {
    return this.codeExampleService.update(id, updateCodeExampleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codeExampleService.remove(id);
  }
}
