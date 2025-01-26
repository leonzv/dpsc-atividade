import { RouteObject } from 'react-router-dom'
import { LoadingSpinner } from '../../shared/components/LoadingSpinner'
import { lazy, Suspense } from 'react'
import LoginPage from '../../modules/auth/pages/LoginPage'
import RegisterPage from '../../modules/auth/pages/RegisterPage'
import { BaseLayout } from '../../shared/components/layout/BaseLayout'
import { Outlet } from 'react-router-dom'

import booksRoutes from '../../modules/books/routes/BooksRoutes'

const HomePage = lazy(() => import('../../modules/auth/pages/HomePage'))
const ErrorPage = lazy(() => import('../../shared/components/ErrorPage'))

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
)

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <BaseLayout>
        <Outlet />
      </BaseLayout>
    ),
    children: [
      {
        path: '/',
        element: withSuspense(HomePage)
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      ...booksRoutes,
      {
        path: '*',
        element: withSuspense(ErrorPage)
      }
    ]
  }
]
