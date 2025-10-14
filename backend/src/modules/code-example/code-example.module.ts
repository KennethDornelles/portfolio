import { Module } from '@nestjs/common';
import { CodeExampleService } from './code-example.service';
import { CodeExampleController } from './code-example.controller';

@Module({
  controllers: [CodeExampleController],
  providers: [CodeExampleService],
})
export class CodeExampleModule {}
