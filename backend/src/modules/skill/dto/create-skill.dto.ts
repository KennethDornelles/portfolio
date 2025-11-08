import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { SkillCategory } from '@prisma/client';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(SkillCategory)
  category: SkillCategory;

  @IsInt()
  @Min(1)
  @Max(100)
  level: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
