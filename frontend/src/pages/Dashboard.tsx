import { useQuery } from '@tanstack/react-query'
import { booksApi, authorsApi, usersApi, borrowedBooksApi } from '../services/api'

const Dashboard = () => {
  const { data: booksData } = useQuery({ queryKey: ['books'], queryFn: () => booksApi.getAll() })
  const { data: authors } = useQuery({ queryKey: ['authors'], queryFn: () => authorsApi.getAll() })
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: () => usersApi.getAll() })
  const { data: borrowed } = useQuery({ queryKey: ['borrowed-books'], queryFn: () => borrowedBooksApi.getAll() })

  const stats = [
    { label: 'Total Books', value: booksData?.data?.length || 0, icon: '📚', color: 'bg-blue-500' },
    { label: 'Authors', value: authors?.length || 0, icon: '✍️', color: 'bg-green-500' },
    { label: 'Users', value: users?.length || 0, icon: '👥', color: 'bg-purple-500' },
    { label: 'Borrowed', value: borrowed?.filter((b: any) => b.status === 'BORROWED').length || 0, icon: '📖', color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the Library Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white text-3xl w-16 h-16 rounded-full flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Books</h3>
          <div className="space-y-3">
            {booksData?.data?.slice(0, 5).map((book: any) => (
              <div key={book.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.author.name}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Borrowed</h3>
          <div className="space-y-3">
            {borrowed?.slice(0, 5).map((item: any) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.book.title}</p>
                  <p className="text-sm text-gray-500">{item.user.name}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${item.status === 'BORROWED' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
