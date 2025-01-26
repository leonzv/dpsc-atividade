import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../modules/auth/contexts/AuthContext'
import { BookProvider } from '../modules/books/contexts/BookContext'
import { authService } from '../modules/auth/services/auth.service'
import { Toaster } from 'react-hot-toast'
import { bookService } from '../modules/books/services/bookService'
import { router } from './router'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider repository={authService}>
        <BookProvider repository={bookService}>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </BookProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
