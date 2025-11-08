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

export class CreateCodeExampleDto {
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(3, { message: 'O título deve ter pelo menos 3 caracteres' })
  @MaxLength(200, { message: 'O título deve ter no máximo 200 caracteres' })
  title: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  @MaxLength(1000, {
    message: 'A descrição deve ter no máximo 1000 caracteres',
  })
  description?: string;

  @IsString({ message: 'O código deve ser uma string' })
  @IsNotEmpty({ message: 'O código é obrigatório' })
  @MinLength(1, { message: 'O código não pode estar vazio' })
  @MaxLength(10000, { message: 'O código deve ter no máximo 10000 caracteres' })
  code: string;

  @IsString({ message: 'A linguagem deve ser uma string' })
  @IsNotEmpty({ message: 'A linguagem é obrigatória' })
  @MinLength(2, { message: 'A linguagem deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'A linguagem deve ter no máximo 50 caracteres' })
  language: string;

  @IsArray({ message: 'Tags deve ser um array' })
  @ArrayMinSize(1, { message: 'Adicione pelo menos 1 tag' })
  @ArrayMaxSize(20, { message: 'Máximo de 20 tags permitidas' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags: string[];

  @IsOptional()
  @IsBoolean({ message: 'Active deve ser um booleano' })
  active?: boolean;
}
