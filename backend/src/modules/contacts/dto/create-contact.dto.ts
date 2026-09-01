import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'I loved your portfolio! Are you available?' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'Consulta sobre projeto', required: false })
  @IsString()
  @IsOptional()
  subject?: string;
}
