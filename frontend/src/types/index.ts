export interface Author {
  id: string
  name: string
  bio?: string
  country?: string
  createdAt: string
  updatedAt: string
  books?: Book[]
  _count?: {
    books: number
  }
}

export interface Book {
  id: string
  title: string
  isbn: string
  publishedYear: number
  description?: string
  totalCopies: number
  availableCopies: number
  authorId: string
  author: Author
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface BorrowedBook {
  id: string
  userId: string
  bookId: string
  borrowedAt: string
  dueDate: string
  returnedAt?: string
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE'
  user: Pick<User, 'id' | 'name' | 'email'>
  book: Book
  createdAt: string
  updatedAt: string
}
