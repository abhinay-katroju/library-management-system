import { IsNotEmpty, IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: "Harry Potter and the Sorcerer's Stone" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '978-0439708180' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ example: 1997 })
  @IsInt()
  @Min(1000)
  publishedYear: number;

  @ApiProperty({ example: 'The first book in the Harry Potter series', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  totalCopies: number;

  @ApiProperty({ example: 'author-uuid' })
  @IsString()
  @IsNotEmpty()
  authorId: string;
}
