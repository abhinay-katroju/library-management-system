import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    // Verify author exists
    const author = await this.prisma.author.findUnique({
      where: { id: createBookDto.authorId },
    });

    if (!author) {
      throw new BadRequestException('Author not found');
    }

    // Check if ISBN already exists
    const existingBook = await this.prisma.book.findUnique({
      where: { isbn: createBookDto.isbn },
    });

    if (existingBook) {
      throw new BadRequestException('Book with this ISBN already exists');
    }

    return this.prisma.book.create({
      data: {
        ...createBookDto,
        availableCopies: createBookDto.totalCopies,
      },
      include: {
        author: true,
      },
    });
  }

  async findAll(filterDto: FilterBooksDto) {
    const {
      search,
      authorId,
      available,
      publishedYearFrom,
      publishedYearTo,
      page = 1,
      limit = 20,
    } = filterDto;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { isbn: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (available !== undefined) {
      if (available) {
        where.availableCopies = { gt: 0 };
      } else {
        where.availableCopies = 0;
      }
    }

    if (publishedYearFrom || publishedYearTo) {
      where.publishedYear = {};
      if (publishedYearFrom) {
        where.publishedYear.gte = publishedYearFrom;
      }
      if (publishedYearTo) {
        where.publishedYear.lte = publishedYearTo;
      }
    }

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: {
          author: true,
          _count: {
            select: { borrowedBooks: true },
          },
        },
        orderBy: { title: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        borrowedBooks: {
          where: { status: 'BORROWED' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    if (updateBookDto.authorId) {
      const author = await this.prisma.author.findUnique({
        where: { id: updateBookDto.authorId },
      });

      if (!author) {
        throw new BadRequestException('Author not found');
      }
    }

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: {
        author: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.book.delete({
      where: { id },
    });

    return { message: 'Book deleted successfully' };
  }
}
