import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('borrowed-books')
@Controller('borrowed-books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BorrowedBooksController {
  constructor(private readonly borrowedBooksService: BorrowedBooksService) {}

  @Post('borrow')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({ status: 201, description: 'Book borrowed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User or book not found' })
  borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowedBooksService.borrowBook(borrowBookDto);
  }

  @Patch('return/:id')
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  @ApiResponse({ status: 404, description: 'Borrowed book record not found' })
  @ApiResponse({ status: 400, description: 'Book already returned' })
  returnBook(@Param('id') id: string) {
    return this.borrowedBooksService.returnBook(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all borrowed books for a user' })
  @ApiQuery({ name: 'status', required: false, enum: ['BORROWED', 'RETURNED', 'OVERDUE'] })
  @ApiResponse({ status: 200, description: 'Return borrowed books' })
  findByUser(@Param('userId') userId: string, @Query('status') status?: string) {
    return this.borrowedBooksService.findByUser(userId, status);
  }

  @Get()
  @ApiOperation({ summary: 'Get all borrowed books' })
  @ApiQuery({ name: 'status', required: false, enum: ['BORROWED', 'RETURNED', 'OVERDUE'] })
  @ApiResponse({ status: 200, description: 'Return all borrowed books' })
  findAll(@Query('status') status?: string) {
    return this.borrowedBooksService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get borrowed book by ID' })
  @ApiResponse({ status: 200, description: 'Return borrowed book' })
  @ApiResponse({ status: 404, description: 'Borrowed book not found' })
  findOne(@Param('id') id: string) {
    return this.borrowedBooksService.findOne(id);
  }
}
