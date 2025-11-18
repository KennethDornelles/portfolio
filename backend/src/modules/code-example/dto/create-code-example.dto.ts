import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCodeExampleDto {
  @ApiProperty({
    description: 'Título do exemplo de código',
    example: 'Autenticação JWT em Node.js',
    minLength: 3,
    maxLength: 200,
  })
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(3, { message: 'O título deve ter pelo menos 3 caracteres' })
  @MaxLength(200, { message: 'O título deve ter no máximo 200 caracteres' })
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição do exemplo',
    example: 'Exemplo de implementação de autenticação usando JWT...',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  @MaxLength(1000, {
    message: 'A descrição deve ter no máximo 1000 caracteres',
  })
  description?: string;

  @ApiProperty({
    description: 'Código fonte do exemplo',
    example: 'const jwt = require("jsonwebtoken");\n...',
    minLength: 1,
    maxLength: 10000,
  })
  @IsString({ message: 'O código deve ser uma string' })
  @IsNotEmpty({ message: 'O código é obrigatório' })
  @MinLength(1, { message: 'O código não pode estar vazio' })
  @MaxLength(10000, { message: 'O código deve ter no máximo 10000 caracteres' })
  code: string;

  @ApiProperty({
    description: 'Linguagem de programação',
    example: 'javascript',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'A linguagem deve ser uma string' })
  @IsNotEmpty({ message: 'A linguagem é obrigatória' })
  @MinLength(2, { message: 'A linguagem deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'A linguagem deve ter no máximo 50 caracteres' })
  language: string;

  @ApiProperty({
    description: 'Tags relacionadas ao exemplo',
    example: ['JWT', 'Authentication', 'Security'],
    type: [String],
    minItems: 1,
    maxItems: 20,
  })
  @IsArray({ message: 'Tags deve ser um array' })
  @ArrayMinSize(1, { message: 'Adicione pelo menos 1 tag' })
  @ArrayMaxSize(20, { message: 'Máximo de 20 tags permitidas' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags: string[];

  @ApiPropertyOptional({
    description: 'Indica se o exemplo está ativo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Active deve ser um booleano' })
  active?: boolean;
}
