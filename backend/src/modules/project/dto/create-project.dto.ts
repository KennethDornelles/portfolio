import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
  Min,
  IsUrl,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Título do projeto',
    example: 'Sistema de Gestão de Produtos',
    minLength: 3,
    maxLength: 200,
  })
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(3, { message: 'O título deve ter pelo menos 3 caracteres' })
  @MaxLength(200, { message: 'O título deve ter no máximo 200 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada do projeto',
    example: 'Sistema completo para gestão de produtos com React e Node.js...',
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

  @ApiPropertyOptional({
    description: 'URL da imagem do projeto',
    example: 'https://example.com/project.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL da imagem inválida' })
  image?: string;

  @ApiProperty({
    description: 'Tags/tecnologias utilizadas no projeto',
    example: ['React', 'Node.js', 'PostgreSQL'],
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
    description: 'URL do repositório no GitHub',
    example: 'https://github.com/usuario/projeto',
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL do GitHub inválida' })
  githubUrl?: string;

  @ApiPropertyOptional({
    description: 'URL do projeto em produção',
    example: 'https://meu-projeto.com',
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL do projeto inválida' })
  liveUrl?: string;

  @ApiPropertyOptional({
    description: 'Indica se o projeto é destaque',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Featured deve ser um booleano' })
  featured?: boolean;

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
