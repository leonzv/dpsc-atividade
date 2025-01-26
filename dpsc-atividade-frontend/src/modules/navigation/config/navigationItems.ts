import { Book, PlusCircle } from 'lucide-react'
import { NavigationGroup } from '../../../shared/types/navigation.types'

export const navigationConfig: NavigationGroup[] = [
  {
    title: 'Livros',
    items: [
      {
        path: '/books/add',
        title: 'Adicionar Livro',
        icon: PlusCircle,
        requiredRoles: ['admin'],
        exact: true
      },
      {
        path: '/books',
        title: 'Catálogo',
        icon: Book,
        exact: true
      }
    ]
  }
]
