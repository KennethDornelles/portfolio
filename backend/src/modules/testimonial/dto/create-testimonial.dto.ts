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

export class CreateTestimonialDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsString({ message: 'O cargo deve ser uma string' })
  @IsNotEmpty({ message: 'O cargo é obrigatório' })
  @MinLength(2, { message: 'O cargo deve ter pelo menos 2 caracteres' })
  @MaxLength(150, { message: 'O cargo deve ter no máximo 150 caracteres' })
  role: string;

  @IsOptional()
  @IsString({ message: 'A empresa deve ser uma string' })
  @MaxLength(150, { message: 'A empresa deve ter no máximo 150 caracteres' })
  company?: string;

  @IsString({ message: 'A mensagem deve ser uma string' })
  @IsNotEmpty({ message: 'A mensagem é obrigatória' })
  @MinLength(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' })
  @MaxLength(1000, {
    message: 'A mensagem deve ter no máximo 1000 caracteres',
  })
  message: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL do avatar inválida' })
  avatar?: string;

  @IsOptional()
  @IsInt({ message: 'A avaliação deve ser um número inteiro' })
  @Min(1, { message: 'A avaliação deve ser entre 1 e 5' })
  @Max(5, { message: 'A avaliação deve ser entre 1 e 5' })
  rating?: number;

  @IsOptional()
  @IsBoolean({ message: 'Active deve ser um booleano' })
  active?: boolean;

  @IsOptional()
  @IsInt({ message: 'Order deve ser um número inteiro' })
  @Min(0, { message: 'Order deve ser maior ou igual a 0' })
  order?: number;
}
