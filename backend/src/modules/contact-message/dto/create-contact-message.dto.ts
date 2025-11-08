import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { MessageStatus } from '@prisma/client';

export class CreateContactMessageDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsOptional()
  @IsString({ message: 'O assunto deve ser uma string' })
  @MaxLength(200, { message: 'O assunto deve ter no máximo 200 caracteres' })
  subject?: string;

  @IsString({ message: 'A mensagem deve ser uma string' })
  @IsNotEmpty({ message: 'A mensagem é obrigatória' })
  @MinLength(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' })
  @MaxLength(2000, { message: 'A mensagem deve ter no máximo 2000 caracteres' })
  message: string;

  @IsOptional()
  @IsEnum(MessageStatus, {
    message: 'Status deve ser PENDING, READ ou ARCHIVED',
  })
  status?: MessageStatus;
}
