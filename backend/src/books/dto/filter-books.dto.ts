import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterBooksDto {
  @ApiProperty({ required: false, description: 'Search by title, ISBN, or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Filter by author ID' })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiProperty({ required: false, description: 'Filter by availability' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  available?: boolean;

  @ApiProperty({ required: false, description: 'Minimum published year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  publishedYearFrom?: number;

  @ApiProperty({ required: false, description: 'Maximum published year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  publishedYearTo?: number;

  @ApiProperty({ required: false, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 20, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
