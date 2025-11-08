import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsUrl,
  Matches,
} from 'class-validator';

export class CreatePersonalInfoDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(2, { message: 'O título deve ter pelo menos 2 caracteres' })
  @MaxLength(150, { message: 'O título deve ter no máximo 150 caracteres' })
  title: string;

  @IsString({ message: 'A bio deve ser uma string' })
  @IsNotEmpty({ message: 'A bio é obrigatória' })
  @MinLength(10, { message: 'A bio deve ter pelo menos 10 caracteres' })
  @MaxLength(1000, { message: 'A bio deve ter no máximo 1000 caracteres' })
  bio: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string' })
  @Matches(/^[\d\s\-()+]+$/, {
    message: 'Formato de telefone inválido',
  })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'A localização deve ser uma string' })
  @MaxLength(200, {
    message: 'A localização deve ter no máximo 200 caracteres',
  })
  location?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL do avatar inválida' })
  avatar?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL do currículo inválida' })
  resumeUrl?: string;
}
