import { Injectable } from '@nestjs/common';
import { CreateCodeExampleDto } from './dto/create-code-example.dto';
import { UpdateCodeExampleDto } from './dto/update-code-example.dto';

@Injectable()
export class CodeExampleService {
  create(createCodeExampleDto: CreateCodeExampleDto) {
    return 'This action adds a new codeExample';
  }

  findAll() {
    return `This action returns all codeExample`;
  }

  findOne(id: number) {
    return `This action returns a #${id} codeExample`;
  }

  update(id: number, updateCodeExampleDto: UpdateCodeExampleDto) {
    return `This action updates a #${id} codeExample`;
  }

  remove(id: number) {
    return `This action removes a #${id} codeExample`;
  }
}
