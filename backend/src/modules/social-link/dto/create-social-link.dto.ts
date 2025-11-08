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

export class CreateSocialLinkDto {
  @IsString({ message: 'A plataforma deve ser uma string' })
  @IsNotEmpty({ message: 'A plataforma é obrigatória' })
  @MinLength(2, { message: 'A plataforma deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'A plataforma deve ter no máximo 50 caracteres' })
  platform: string;

  @IsUrl({}, { message: 'URL inválida' })
  @IsNotEmpty({ message: 'A URL é obrigatória' })
  url: string;

  @IsOptional()
  @IsString({ message: 'O ícone deve ser uma string' })
  @MaxLength(100, { message: 'O ícone deve ter no máximo 100 caracteres' })
  icon?: string;

  @IsOptional()
  @IsInt({ message: 'Order deve ser um número inteiro' })
  @Min(0, { message: 'Order deve ser maior ou igual a 0' })
  order?: number;

  @IsOptional()
  @IsBoolean({ message: 'Active deve ser um booleano' })
  active?: boolean;
}
