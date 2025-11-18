import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageStatus } from '@prisma/client';

export class CreateContactMessageDto {
  @ApiProperty({
    description: 'Nome do remetente',
    example: 'Maria Santos',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'E-mail do remetente',
    example: 'maria@example.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @ApiPropertyOptional({
    description: 'Assunto da mensagem',
    example: 'Solicitação de orçamento',
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'O assunto deve ser uma string' })
  @MaxLength(200, { message: 'O assunto deve ter no máximo 200 caracteres' })
  subject?: string;

  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Gostaria de saber mais sobre seus serviços...',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString({ message: 'A mensagem deve ser uma string' })
  @IsNotEmpty({ message: 'A mensagem é obrigatória' })
  @MinLength(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' })
  @MaxLength(2000, { message: 'A mensagem deve ter no máximo 2000 caracteres' })
  message: string;

  @ApiPropertyOptional({
    description: 'Status da mensagem',
    enum: MessageStatus,
    example: 'PENDING',
    default: 'PENDING',
  })
  @IsOptional()
  @IsEnum(MessageStatus, {
    message: 'Status deve ser PENDING, READ ou ARCHIVED',
  })
  status?: MessageStatus;
}
