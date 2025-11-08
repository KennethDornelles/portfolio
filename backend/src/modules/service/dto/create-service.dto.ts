import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(3, { message: 'O título deve ter pelo menos 3 caracteres' })
  @MaxLength(150, { message: 'O título deve ter no máximo 150 caracteres' })
  title: string;

  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MinLength(10, { message: 'A descrição deve ter pelo menos 10 caracteres' })
  @MaxLength(1000, {
    message: 'A descrição deve ter no máximo 1000 caracteres',
  })
  description: string;

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
