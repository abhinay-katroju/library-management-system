import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'J.K. Rowling' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'British author best known for the Harry Potter series', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 'United Kingdom', required: false })
  @IsString()
  @IsOptional()
  country?: string;
}
