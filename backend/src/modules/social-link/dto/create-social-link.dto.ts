import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSocialLinkDto {
  @ApiProperty({
    description: 'Nome da plataforma social',
    example: 'GitHub',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'A plataforma deve ser uma string' })
  @IsNotEmpty({ message: 'A plataforma é obrigatória' })
  @MinLength(2, { message: 'A plataforma deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'A plataforma deve ter no máximo 50 caracteres' })
  platform: string;

  @ApiProperty({
    description: 'URL do perfil na rede social',
    example: 'https://github.com/usuario',
  })
  @IsUrl({}, { message: 'URL inválida' })
  @IsNotEmpty({ message: 'A URL é obrigatória' })
  url: string;

  @ApiPropertyOptional({
    description: 'Ícone da rede social',
    example: 'github-icon.svg',
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

  @ApiPropertyOptional({
    description: 'Indica se o link está ativo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Active deve ser um booleano' })
  active?: boolean;
}
