import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty({
    description: 'Nome da pessoa que deu o depoimento',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Cargo da pessoa',
    example: 'Gerente de Projetos',
    minLength: 2,
    maxLength: 150,
  })
  @IsString({ message: 'O cargo deve ser uma string' })
  @IsNotEmpty({ message: 'O cargo é obrigatório' })
  @MinLength(2, { message: 'O cargo deve ter pelo menos 2 caracteres' })
  @MaxLength(150, { message: 'O cargo deve ter no máximo 150 caracteres' })
  role: string;

  @ApiPropertyOptional({
    description: 'Empresa onde a pessoa trabalha',
    example: 'Tech Company',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({ message: 'A empresa deve ser uma string' })
  @MaxLength(150, { message: 'A empresa deve ter no máximo 150 caracteres' })
  company?: string;

  @ApiProperty({
    description: 'Texto do depoimento',
    example: 'Ótimo profissional, entrega sempre no prazo...',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString({ message: 'A mensagem deve ser uma string' })
  @IsNotEmpty({ message: 'A mensagem é obrigatória' })
  @MinLength(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' })
  @MaxLength(1000, {
    message: 'A mensagem deve ter no máximo 1000 caracteres',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'URL da foto de perfil',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL do avatar inválida' })
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Avaliação de 1 a 5 estrelas',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt({ message: 'A avaliação deve ser um número inteiro' })
  @Min(1, { message: 'A avaliação deve ser entre 1 e 5' })
  @Max(5, { message: 'A avaliação deve ser entre 1 e 5' })
  rating?: number;

  @ApiPropertyOptional({
    description: 'Indica se o depoimento está ativo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Active deve ser um booleano' })
  active?: boolean;

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
