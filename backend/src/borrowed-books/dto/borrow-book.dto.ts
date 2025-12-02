import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'book-uuid' })
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({ example: '2024-12-31T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;
}
