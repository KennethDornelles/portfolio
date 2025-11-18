import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillCategory } from '@prisma/client';

export class CreateSkillDto {
  @ApiProperty({
    description: 'Nome da habilidade',
    example: 'React',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'O nome da habilidade deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da habilidade é obrigatório' })
  @MinLength(2, {
    message: 'O nome da habilidade deve ter pelo menos 2 caracteres',
  })
  @MaxLength(100, {
    message: 'O nome da habilidade deve ter no máximo 100 caracteres',
  })
  name: string;

  @ApiProperty({
    description: 'Categoria da habilidade',
    enum: SkillCategory,
    example: 'FRONTEND',
  })
  @IsEnum(SkillCategory, {
    message:
      'Categoria inválida. Use: FRONTEND, BACKEND, DATABASE, DEVOPS, TOOLS ou OTHER',
  })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  category: SkillCategory;

  @ApiProperty({
    description: 'Nível de proficiência (1-100)',
    example: 85,
    minimum: 1,
    maximum: 100,
  })
  @IsInt({ message: 'O nível deve ser um número inteiro' })
  @Min(1, { message: 'O nível deve ser entre 1 e 100' })
  @Max(100, { message: 'O nível deve ser entre 1 e 100' })
  @IsNotEmpty({ message: 'O nível é obrigatório' })
  level: number;

  @ApiPropertyOptional({
    description: 'Ícone ou imagem da habilidade',
    example: 'react-icon.svg',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'O ícone deve ser uma string' })
  @MaxLength(100, { message: 'O ícone deve ter no máximo 100 caracteres' })
  icon?: string;

  @ApiPropertyOptional({
    description: 'Ordem de exibição',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Order deve ser um número inteiro' })
  @Min(0, { message: 'Order deve ser maior ou igual a 0' })
  order?: number;
}
