import { IsString, IsOptional, IsUrl, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Awesome Portfolio' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'my-awesome-portfolio' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'A brief description of the project.' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: '# Markdown Content...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.png' })
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'https://github.com/user/repo' })
  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;

  @ApiPropertyOptional({ example: 'https://my-project.com' })
  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ type: [String], description: 'Array of Technology IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologyIds?: string[];
}
