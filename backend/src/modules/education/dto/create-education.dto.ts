import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsInt,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEducationDto {
  @ApiProperty({
    description: 'Nome da instituição de ensino',
    example: 'Universidade de São Paulo',
    minLength: 2,
    maxLength: 200,
  })
  @IsString({ message: 'O nome da instituição deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da instituição é obrigatório' })
  @MinLength(2, {
    message: 'O nome da instituição deve ter pelo menos 2 caracteres',
  })
  @MaxLength(200, {
    message: 'O nome da instituição deve ter no máximo 200 caracteres',
  })
  institution: string;

  @ApiProperty({
    description: 'Grau acadêmico',
    example: 'Bacharelado em Ciência da Computação',
    minLength: 2,
    maxLength: 150,
  })
  @IsString({ message: 'O grau deve ser uma string' })
  @IsNotEmpty({ message: 'O grau é obrigatório' })
  @MinLength(2, { message: 'O grau deve ter pelo menos 2 caracteres' })
  @MaxLength(150, { message: 'O grau deve ter no máximo 150 caracteres' })
  degree: string;

  @ApiPropertyOptional({
    description: 'Campo de estudo',
    example: 'Engenharia de Software',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({ message: 'O campo de estudo deve ser uma string' })
  @MaxLength(150, {
    message: 'O campo de estudo deve ter no máximo 150 caracteres',
  })
  field?: string;

  @ApiProperty({
    description: 'Data de início',
    example: '2018-03-01',
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'Data de início inválida (formato: YYYY-MM-DD)' },
  )
  @IsNotEmpty({ message: 'A data de início é obrigatória' })
  startDate: string;

  @ApiPropertyOptional({
    description: 'Data de término',
    example: '2022-12-20',
    format: 'date',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Data de término inválida (formato: YYYY-MM-DD)' },
  )
  endDate?: string;

  @IsOptional()
  @IsBoolean({ message: 'Current deve ser um booleano' })
  current?: boolean;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  @MaxLength(1000, {
    message: 'A descrição deve ter no máximo 1000 caracteres',
  })
  description?: string;

  @IsOptional()
  @IsString({ message: 'A nota deve ser uma string' })
  @MaxLength(50, { message: 'A nota deve ter no máximo 50 caracteres' })
  grade?: string;

  @IsOptional()
  @IsInt({ message: 'Order deve ser um número inteiro' })
  @Min(0, { message: 'Order deve ser maior ou igual a 0' })
  order?: number;
}
