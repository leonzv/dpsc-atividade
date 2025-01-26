import { useForm } from 'react-hook-form'
import { Button } from './Button'

type SearchBarProps = {
  onSearch: (term: string) => void
  placeholder?: string
  className?: string
}

type SearchForm = {
  searchTerm: string
}

export const SearchBar = ({
  onSearch,
  placeholder = 'Buscar...',
  className = ''
}: SearchBarProps) => {
  const { register, handleSubmit } = useForm<SearchForm>()

  const onSubmit = (data: SearchForm) => {
    onSearch(data.searchTerm)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex gap-2 ${className}`}
    >
      <input
        type="text"
        {...register('searchTerm')}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button type="submit">Buscar</Button>
    </form>
  )
}
