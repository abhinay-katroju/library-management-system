import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Injectable()
export class BorrowedBooksService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(borrowBookDto: BorrowBookDto) {
    const { userId, bookId, dueDate } = borrowBookDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if book exists and is available
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.availableCopies <= 0) {
      throw new BadRequestException('No copies of this book are available');
    }

    // Check if user already has this book borrowed
    const existingBorrow = await this.prisma.borrowedBook.findFirst({
      where: {
        userId,
        bookId,
        status: 'BORROWED',
      },
    });

    if (existingBorrow) {
      throw new BadRequestException('User has already borrowed this book');
    }

    // Create borrowed book record and update available copies
    const [borrowedBook] = await this.prisma.$transaction([
      this.prisma.borrowedBook.create({
        data: {
          userId,
          bookId,
          dueDate: new Date(dueDate),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          book: {
            include: {
              author: true,
            },
          },
        },
      }),
      this.prisma.book.update({
        where: { id: bookId },
        data: {
          availableCopies: {
            decrement: 1,
          },
        },
      }),
    ]);

    return borrowedBook;
  }

  async returnBook(id: string) {
    const borrowedBook = await this.prisma.borrowedBook.findUnique({
      where: { id },
      include: {
        book: true,
      },
    });

    if (!borrowedBook) {
      throw new NotFoundException('Borrowed book record not found');
    }

    if (borrowedBook.status === 'RETURNED') {
      throw new BadRequestException('Book has already been returned');
    }

    // Update borrowed book status and increment available copies
    const [updatedBorrowedBook] = await this.prisma.$transaction([
      this.prisma.borrowedBook.update({
        where: { id },
        data: {
          status: 'RETURNED',
          returnedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          book: {
            include: {
              author: true,
            },
          },
        },
      }),
      this.prisma.book.update({
        where: { id: borrowedBook.bookId },
        data: {
          availableCopies: {
            increment: 1,
          },
        },
      }),
    ]);

    return updatedBorrowedBook;
  }

  async findByUser(userId: string, status?: string) {
    const where: any = { userId };

    if (status && ['BORROWED', 'RETURNED', 'OVERDUE'].includes(status)) {
      where.status = status;
    }

    const borrowedBooks = await this.prisma.borrowedBook.findMany({
      where,
      include: {
        book: {
          include: {
            author: true,
          },
        },
      },
      orderBy: { borrowedAt: 'desc' },
    });

    return borrowedBooks;
  }

  async findAll(status?: string) {
    const where: any = {};

    if (status && ['BORROWED', 'RETURNED', 'OVERDUE'].includes(status)) {
      where.status = status;
    }

    const borrowedBooks = await this.prisma.borrowedBook.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: {
          include: {
            author: true,
          },
        },
      },
      orderBy: { borrowedAt: 'desc' },
    });

    return borrowedBooks;
  }

  async findOne(id: string) {
    const borrowedBook = await this.prisma.borrowedBook.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!borrowedBook) {
      throw new NotFoundException('Borrowed book record not found');
    }

    return borrowedBook;
  }
}
