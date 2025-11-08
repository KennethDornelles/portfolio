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

export class CreateProjectDto {
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(3, { message: 'O título deve ter pelo menos 3 caracteres' })
  @MaxLength(200, { message: 'O título deve ter no máximo 200 caracteres' })
  title: string;

  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MinLength(10, { message: 'A descrição deve ter pelo menos 10 caracteres' })
  @MaxLength(2000, {
    message: 'A descrição deve ter no máximo 2000 caracteres',
  })
  description: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL da imagem inválida' })
  image?: string;

  @IsArray({ message: 'Tags deve ser um array' })
  @ArrayMinSize(1, { message: 'Adicione pelo menos 1 tag' })
  @ArrayMaxSize(20, { message: 'Máximo de 20 tags permitidas' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags: string[];

  @IsOptional()
  @IsUrl({}, { message: 'URL do GitHub inválida' })
  githubUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL do projeto inválida' })
  liveUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'Featured deve ser um booleano' })
  featured?: boolean;

  @IsOptional()
  @IsInt({ message: 'Order deve ser um número inteiro' })
  @Min(0, { message: 'Order deve ser maior ou igual a 0' })
  order?: number;
}
