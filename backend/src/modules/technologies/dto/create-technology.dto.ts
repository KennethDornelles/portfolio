import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTechnologyDto {
  @ApiProperty({ example: 'React' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '⚛️' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 'Frontend', default: 'Other' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 85, default: 75, minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  proficiencyLevel?: number;
}
