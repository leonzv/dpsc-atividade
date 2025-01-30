import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BookForm } from '../BookForm'
import { useBooks } from '../../hooks/useBooks'
import { useBookSuggestions } from '../../hooks/useBookSuggestions'
import { BrowserRouter as Router } from 'react-router-dom'

jest.mock('@/shared/services/api')

jest.mock('../../hooks/useBooks')
jest.mock('../../hooks/useBookSuggestions')

const mockedUseBooks = jest.mocked(useBooks)
const mockedUseBookSuggestions = jest.mocked(useBookSuggestions)

const mockCreateBook = jest.fn()
const mockUpdateBook = jest.fn()
const mockHandleSuggestions = jest.fn()

mockedUseBooks.mockReturnValue({
  createBook: mockCreateBook,
  updateBook: mockUpdateBook,
  books: [],
  loading: false,
  error: null,
  deleteBook: jest.fn(),
  fetchBooks: jest.fn(),
  pagination: null,
  setSearchQuery: jest.fn()
})

mockedUseBookSuggestions.mockReturnValue({
  suggestions: [],
  setSuggestions: jest.fn(),
  handleSuggestions: mockHandleSuggestions
})

test('envia o formulário corretamente', async () => {
  render(
    <Router>
      <BookForm />
    </Router>
  )
  fireEvent.change(screen.getByLabelText(/Título/i), {
    target: { value: 'Novo Livro' }
  })
  fireEvent.change(screen.getByLabelText(/Autor/i), {
    target: { value: 'Autor Desconhecido' }
  })
  fireEvent.change(screen.getByLabelText(/Ano de Publicação/i), {
    target: { value: '2021' }
  })
  fireEvent.change(screen.getByLabelText(/Gênero/i), {
    target: { value: 'Ficção' }
  })
  fireEvent.change(screen.getByLabelText(/Resumo/i), {
    target: { value: 'Um livro interessante.' }
  })
  fireEvent.click(screen.getByRole('button', { name: /Criar Livro/i }))

  await waitFor(() => {
    expect(mockCreateBook).toHaveBeenCalledWith({
      title: 'Novo Livro',
      author: 'Autor Desconhecido',
      published_year: 2021,
      genre: 'Ficção',
      summary: 'Um livro interessante.',
      cover_image: undefined
    })
  })
})
