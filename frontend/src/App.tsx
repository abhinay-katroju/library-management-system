import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Authors from './pages/Authors'
import Users from './pages/Users'
import BorrowedBooks from './pages/BorrowedBooks'
import MyBorrowedBooks from './pages/MyBorrowedBooks'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="authors" element={<Authors />} />
          <Route path="users" element={<Users />} />
          <Route path="borrowed-books" element={<BorrowedBooks />} />
          <Route path="my-borrowed-books" element={<MyBorrowedBooks />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
