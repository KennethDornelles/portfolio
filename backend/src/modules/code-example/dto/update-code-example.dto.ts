import { PartialType } from '@nestjs/mapped-types';
import { CreateCodeExampleDto } from './create-code-example.dto';

export class UpdateCodeExampleDto extends PartialType(CreateCodeExampleDto) {}
