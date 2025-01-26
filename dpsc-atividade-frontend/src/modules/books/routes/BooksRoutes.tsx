import { RouteObject } from 'react-router-dom'
import BooksPage from '../pages/BooksPage'
import AddBookPage from '../pages/AddBookPage'
import BookDetailsPage from '../pages/BookDetailsPage'
import EditBookPage from '../pages/EditBookPage'
import { ProtectedRoute } from '../../../shared/components/ProtectedRoute'
import { Suspense } from 'react'
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner'

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
)

const ProtectedAddBookPage = () => (
  <ProtectedRoute requiredRoles={['admin']}>
    {withSuspense(AddBookPage)}
  </ProtectedRoute>
)

const ProtectedEditBookPage = () => (
  <ProtectedRoute requiredRoles={['admin']}>
    {withSuspense(EditBookPage)}
  </ProtectedRoute>
)

const BooksRoutes: RouteObject[] = [
  {
    path: '/books',
    element: withSuspense(BooksPage)
  },
  {
    path: '/books/add',
    element: <ProtectedAddBookPage />
  },
  {
    path: '/books/:id',
    element: withSuspense(BookDetailsPage)
  },
  {
    path: '/books/:id/edit',
    element: <ProtectedEditBookPage />
  }
]

export default BooksRoutes
