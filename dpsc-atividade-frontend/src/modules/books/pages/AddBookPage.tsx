import { FC } from 'react'
import { BookForm } from '../components/BookForm'

const AddBookPage: FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Livro</h2>
      <BookForm />
    </div>
  )
}

export default AddBookPage
