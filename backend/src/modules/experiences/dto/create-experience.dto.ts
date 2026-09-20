import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  period: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  focus: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cases?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  highlights?: string[];

  @ApiPropertyOptional({
    description: 'Translated technical scope/results indicators',
    example: ['EXP_PURPLE_RESULT_1', 'EXP_PURPLE_RESULT_2'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  results?: string[];

  @ApiProperty({
    description: 'JSON structure for tech stack',
    example: [{ name: 'NestJS', color: 'bg-red-600' }],
  })
  @IsNotEmpty()
  techStack: Prisma.InputJsonValue;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  order?: number;
}
