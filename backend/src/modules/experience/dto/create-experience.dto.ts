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

export class CreateExperienceDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Tech Solutions Inc.',
    minLength: 2,
    maxLength: 150,
  })
  @IsString({ message: 'O nome da empresa deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da empresa é obrigatório' })
  @MinLength(2, {
    message: 'O nome da empresa deve ter pelo menos 2 caracteres',
  })
  @MaxLength(150, {
    message: 'O nome da empresa deve ter no máximo 150 caracteres',
  })
  company: string;

  @ApiProperty({
    description: 'Cargo ocupado',
    example: 'Desenvolvedor Sênior',
    minLength: 2,
    maxLength: 150,
  })
  @IsString({ message: 'O cargo deve ser uma string' })
  @IsNotEmpty({ message: 'O cargo é obrigatório' })
  @MinLength(2, { message: 'O cargo deve ter pelo menos 2 caracteres' })
  @MaxLength(150, { message: 'O cargo deve ter no máximo 150 caracteres' })
  position: string;

  @ApiProperty({
    description: 'Descrição das atividades e responsabilidades',
    example: 'Desenvolvimento de aplicações web usando React e Node.js...',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MinLength(10, { message: 'A descrição deve ter pelo menos 10 caracteres' })
  @MaxLength(2000, {
    message: 'A descrição deve ter no máximo 2000 caracteres',
  })
  description: string;

  @ApiProperty({
    description: 'Data de início',
    example: '2020-01-15',
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'Data de início inválida (formato: YYYY-MM-DD)' },
  )
  @IsNotEmpty({ message: 'A data de início é obrigatória' })
  startDate: string;

  @ApiPropertyOptional({
    description: 'Data de término (deixe em branco se ainda trabalha)',
    example: '2023-06-30',
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
  @IsString({ message: 'A localização deve ser uma string' })
  @MaxLength(200, {
    message: 'A localização deve ter no máximo 200 caracteres',
  })
  location?: string;

  @IsOptional()
  @IsInt({ message: 'Order deve ser um número inteiro' })
  @Min(0, { message: 'Order deve ser maior ou igual a 0' })
  order?: number;
}
