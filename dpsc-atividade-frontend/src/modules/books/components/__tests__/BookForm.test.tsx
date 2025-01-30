import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BookForm } from '../BookForm'
import { useBooks } from '../../hooks/useBooks'
import { useBookSuggestions } from '../../hooks/useBookSuggestions'
import { BrowserRouter } from 'react-router-dom'

jest.mock('@/shared/services/api')
jest.mock('../../hooks/useBooks')
jest.mock('../../hooks/useBookSuggestions')

const mockedUseBooks = jest.mocked(useBooks)
const mockedUseBookSuggestions = jest.mocked(useBookSuggestions)

const mockCreateBook = jest.fn()
const mockUpdateBook = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()

  mockedUseBooks.mockImplementation(() => ({
    createBook: mockCreateBook,
    updateBook: mockUpdateBook,
    books: [],
    loading: false,
    error: null,
    deleteBook: jest.fn(),
    fetchBooks: jest.fn(),
    pagination: null,
    setSearchQuery: jest.fn()
  }))

  mockedUseBookSuggestions.mockImplementation(() => ({
    suggestions: [],
    setSuggestions: jest.fn(),
    handleSuggestions: jest.fn()
  }))
})

test('renderiza o formulário de livro corretamente', () => {
  render(
    <BrowserRouter>
      <BookForm />
    </BrowserRouter>
  )
  expect(screen.getByLabelText(/Título/i)).toBeInTheDocument()
})
