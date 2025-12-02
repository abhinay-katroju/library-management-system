import { api } from '../lib/axios'

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (data: { email: string; name: string; password: string; role?: string }) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
}

export const booksApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/books', { params })
    return response.data
  },

  getOne: async (id: string) => {
    const response = await api.get(`/books/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/books', data)
    return response.data
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/books/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/books/${id}`)
    return response.data
  },
}

export const authorsApi = {
  getAll: async (search?: string) => {
    const response = await api.get('/authors', { params: { search } })
    return response.data
  },

  getOne: async (id: string) => {
    const response = await api.get(`/authors/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/authors', data)
    return response.data
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/authors/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/authors/${id}`)
    return response.data
  },
}

export const usersApi = {
  getAll: async () => {
    const response = await api.get('/users')
    return response.data
  },

  getOne: async (id: string) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/users', data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}

export const borrowedBooksApi = {
  getAll: async (status?: string) => {
    const response = await api.get('/borrowed-books', { params: { status } })
    return response.data
  },

  getByUser: async (userId: string, status?: string) => {
    const response = await api.get(`/borrowed-books/user/${userId}`, { params: { status } })
    return response.data
  },

  borrow: async (data: { userId: string; bookId: string; dueDate: string }) => {
    const response = await api.post('/borrowed-books/borrow', data)
    return response.data
  },

  return: async (id: string) => {
    const response = await api.patch(`/borrowed-books/return/${id}`)
    return response.data
  },
}
