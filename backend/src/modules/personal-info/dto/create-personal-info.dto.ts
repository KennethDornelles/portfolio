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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePersonalInfoDto {
  @ApiProperty({
    description: 'Nome completo',
    example: 'Kenneth Dornelles',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Título profissional',
    example: 'Desenvolvedor Full Stack',
    minLength: 2,
    maxLength: 150,
  })
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(2, { message: 'O título deve ter pelo menos 2 caracteres' })
  @MaxLength(150, { message: 'O título deve ter no máximo 150 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Biografia profissional',
    example:
      'Desenvolvedor apaixonado por tecnologia com 5 anos de experiência...',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString({ message: 'A bio deve ser uma string' })
  @IsNotEmpty({ message: 'A bio é obrigatória' })
  @MinLength(10, { message: 'A bio deve ter pelo menos 10 caracteres' })
  @MaxLength(1000, { message: 'A bio deve ter no máximo 1000 caracteres' })
  bio: string;

  @ApiProperty({
    description: 'Endereço de e-mail',
    example: 'kenneth@example.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @ApiPropertyOptional({
    description: 'Número de telefone',
    example: '+55 11 98765-4321',
  })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string' })
  @Matches(/^[\d\s\-()+]+$/, {
    message: 'Formato de telefone inválido',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Localização',
    example: 'São Paulo, SP - Brasil',
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'A localização deve ser uma string' })
  @MaxLength(200, {
    message: 'A localização deve ter no máximo 200 caracteres',
  })
  location?: string;

  @ApiPropertyOptional({
    description: 'URL da foto de perfil',
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL do currículo inválida' })
  resumeUrl?: string;
}
