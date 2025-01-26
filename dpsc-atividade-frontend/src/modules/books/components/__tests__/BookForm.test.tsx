import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BookForm } from '../BookForm'
import { useBooks } from '../../hooks/useBooks'
import { useBookSuggestions } from '../../hooks/useBookSuggestions'
import { BrowserRouter } from 'react-router-dom'

jest.mock('@/shared/services/api')

jest.mock('../../hooks/useBooks')
jest.mock('../../hooks/useBookSuggestions')

const mockUseBooks = useBooks as jest.MockedFunction<typeof useBooks>
const mockUseBookSuggestions = useBookSuggestions as jest.MockedFunction<
  typeof useBookSuggestions
>

beforeEach(() => {
  mockUseBooks.mockReturnValue({
    createBook: jest.fn(),
    updateBook: jest.fn(),
    books: [],
    loading: false,
    error: null,
    useGetBook: jest.fn(),
    deleteBook: jest.fn(),
    fetchBooks: jest.fn(),
    pagination: undefined
  })

  mockUseBookSuggestions.mockReturnValue({
    suggestions: [],
    setSuggestions: jest.fn(),
    handleSuggestions: jest.fn()
  })
})

test('renderiza o formulário de livro corretamente', () => {
  render(
    <BrowserRouter>
      <BookForm />
    </BrowserRouter>
  )
  expect(screen.getByLabelText(/Título/i)).toBeInTheDocument()
})
