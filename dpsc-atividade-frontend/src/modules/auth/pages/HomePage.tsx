import { BookOpen } from 'lucide-react'
import { QuickAccess } from '../../../shared/components/QuickAccess'

const quickLinks = [
  {
    title: 'Catálogo',
    description: 'Gerenciar livros do catálogo',
    icon: BookOpen,
    link: '/books',
    color: 'text-accent'
  },
  {
    title: 'Adicionar Livro',
    description: 'Adicionar um novo livro ao catálogo',
    icon: BookOpen,
    link: '/books/add',
    color: 'text-accent'
  }
]

const HomePage = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-text">Acesso Rápido</h1>
      <QuickAccess items={quickLinks} />
    </div>
  )
}

export default HomePage
