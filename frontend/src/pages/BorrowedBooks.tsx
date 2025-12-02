import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { borrowedBooksApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { BorrowedBook } from '../types'

const BorrowedBooks = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: borrowedBooks, isLoading } = useQuery({
    queryKey: ['borrowed-books'],
    queryFn: () => borrowedBooksApi.getAll(),
    enabled: user?.role === 'ADMIN',
  })

  const returnMutation = useMutation({
    mutationFn: borrowedBooksApi.return,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowed-books'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book returned successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to return book')
    },
  })

  if (user?.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600 mt-2">Only administrators can view this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Borrowed Books</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : !borrowedBooks || borrowedBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No borrowed books found</td>
                </tr>
              ) : (
                borrowedBooks.map((item: BorrowedBook) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.book.title}</div>
                      <div className="text-sm text-gray-500">{item.book.isbn}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.user.name}</div>
                      <div className="text-sm text-gray-500">{item.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.borrowedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        item.status === 'BORROWED' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'RETURNED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.status === 'BORROWED' && (
                        <button
                          onClick={() => returnMutation.mutate(item.id)}
                          disabled={returnMutation.isPending}
                          className="text-primary-600 hover:text-primary-900 disabled:opacity-50"
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BorrowedBooks
