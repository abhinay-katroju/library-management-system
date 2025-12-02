import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {},
    create: {
      email: 'admin@library.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create Regular Users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('Users created:', { admin, user1, user2 });

  // Create Authors
  const author1 = await prisma.author.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'J.K. Rowling',
      bio: 'British author best known for the Harry Potter series',
      country: 'United Kingdom',
    },
  });

  const author2 = await prisma.author.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'George Orwell',
      bio: 'English novelist and essayist known for 1984 and Animal Farm',
      country: 'United Kingdom',
    },
  });

  const author3 = await prisma.author.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      name: 'Agatha Christie',
      bio: 'English writer known for mystery novels',
      country: 'United Kingdom',
    },
  });

  const author4 = await prisma.author.upsert({
    where: { id: '4' },
    update: {},
    create: {
      id: '4',
      name: 'Stephen King',
      bio: 'American author of horror, supernatural fiction, and fantasy',
      country: 'United States',
    },
  });

  console.log('Authors created:', { author1, author2, author3, author4 });

  // Create Books
  const book1 = await prisma.book.upsert({
    where: { isbn: '978-0439708180' },
    update: {},
    create: {
      title: "Harry Potter and the Sorcerer's Stone",
      isbn: '978-0439708180',
      publishedYear: 1997,
      description: 'The first book in the Harry Potter series',
      totalCopies: 5,
      availableCopies: 5,
      authorId: author1.id,
    },
  });

  const book2 = await prisma.book.upsert({
    where: { isbn: '978-0451524935' },
    update: {},
    create: {
      title: '1984',
      isbn: '978-0451524935',
      publishedYear: 1949,
      description: 'Dystopian social science fiction novel',
      totalCopies: 3,
      availableCopies: 3,
      authorId: author2.id,
    },
  });

  const book3 = await prisma.book.upsert({
    where: { isbn: '978-0062073488' },
    update: {},
    create: {
      title: 'Murder on the Orient Express',
      isbn: '978-0062073488',
      publishedYear: 1934,
      description: 'Detective novel featuring Hercule Poirot',
      totalCopies: 4,
      availableCopies: 4,
      authorId: author3.id,
    },
  });

  const book4 = await prisma.book.upsert({
    where: { isbn: '978-0385121675' },
    update: {},
    create: {
      title: 'The Shining',
      isbn: '978-0385121675',
      publishedYear: 1977,
      description: 'Horror novel about the Overlook Hotel',
      totalCopies: 3,
      availableCopies: 3,
      authorId: author4.id,
    },
  });

  const book5 = await prisma.book.upsert({
    where: { isbn: '978-0140278736' },
    update: {},
    create: {
      title: 'Animal Farm',
      isbn: '978-0140278736',
      publishedYear: 1945,
      description: 'Allegorical novella about Soviet Russia',
      totalCopies: 4,
      availableCopies: 4,
      authorId: author2.id,
    },
  });

  console.log('Books created:', { book1, book2, book3, book4, book5 });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
