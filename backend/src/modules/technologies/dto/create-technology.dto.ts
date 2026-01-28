import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTechnologyDto {
  @ApiProperty({ example: 'React' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'https://cdn.icon.com/react.png' })
  @IsString()
  @IsOptional()
  icon?: string;
}
