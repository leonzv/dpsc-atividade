import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../../shared/components/Input'
import { Button } from '../../../shared/components/Button'
import { CreateBookDTO, UpdateBookDTO } from '../types/book.types'
import { useBooks } from '../hooks/useBooks'
import { BookFormData, bookFormSchema } from '../schemas/bookSchema'
import { FileInput } from '../../../shared/components/FileInput'
import { TextAreaInput } from '../../../shared/components/TextAreaInput'
import toast from 'react-hot-toast'
import { SuggestionCard } from './SuggestionCard'
import { urlToFile } from '../../../shared/utils/fileUtils'
import { useBookSuggestions } from '../hooks/useBookSuggestions'
import { useFormError } from '../../../shared/hooks/useFormError'

interface BookFormProps {
  initialData?: UpdateBookDTO
  bookId?: number
}

export const BookForm: FC<BookFormProps> = ({ initialData, bookId }) => {
  const navigate = useNavigate()
  const { createBook, updateBook } = useBooks()
  const { suggestions, setSuggestions, handleSuggestions } =
    useBookSuggestions()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    mode: 'all',
    defaultValues: {
      title: initialData?.title || '',
      author: initialData?.author || '',
      published_year: initialData?.published_year ?? new Date().getFullYear(),
      genre: initialData?.genre || '',
      summary: initialData?.summary || '',
      cover_image: undefined
    }
  })

  const { handleError } = useFormError(setError)

  const hasLoadedCover = useRef(false)

  useEffect(() => {
    if (
      !hasLoadedCover.current &&
      initialData?.cover_image &&
      typeof initialData.cover_image === 'string'
    ) {
      const loadExistingCover = async () => {
        try {
          const coverImage = initialData.cover_image as string
          const file = await urlToFile(
            coverImage,
            'existing-cover.jpg',
            'image/jpeg'
          )
          setValue('cover_image', file)
          setImagePreview(coverImage)
        } catch {
          toast.error('Erro ao carregar a imagem existente.')
        }
      }
      loadExistingCover()
      hasLoadedCover.current = true
    }
  }, [initialData, setValue])

  const handleInputChange = useCallback(
    (formData: CreateBookDTO) => {
      handleSuggestions(formData)
    },
    [handleSuggestions]
  )

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue('title', value)
    const formData: CreateBookDTO = {
      title: value,
      author: watch('author') || '',
      published_year: watch('published_year') || new Date().getFullYear(),
      genre: watch('genre') || '',
      summary: watch('summary') || '',
      cover_image: undefined
    }
    handleInputChange(formData)
  }

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue('author', value)
    const formData: CreateBookDTO = {
      title: watch('title') || '',
      author: value,
      published_year: watch('published_year') || new Date().getFullYear(),
      genre: watch('genre') || '',
      summary: watch('summary') || '',
      cover_image: undefined
    }
    handleInputChange(formData)
  }

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setValue('summary', value)
    const formData: CreateBookDTO = {
      title: watch('title') || '',
      author: watch('author') || '',
      published_year: watch('published_year') || new Date().getFullYear(),
      genre: watch('genre') || '',
      summary: value,
      cover_image: undefined
    }
    handleInputChange(formData)
  }

  const handleSelectSuggestion = async (sug: CreateBookDTO) => {
    setValue('title', sug.title)
    setValue('author', sug.author)
    setValue('published_year', sug.published_year)
    setValue('genre', sug.genre)
    setValue('summary', sug.summary)
    setSuggestions([])

    if (sug.cover_image && typeof sug.cover_image === 'string') {
      try {
        const file = await urlToFile(
          sug.cover_image,
          'suggested-cover.jpg',
          'image/jpeg'
        )
        setValue('cover_image', file)
        setImagePreview(sug.cover_image)
      } catch {
        toast.error('Erro ao converter a imagem da sugestão.')
      }
    } else {
      setImagePreview(null)
      setValue('cover_image', undefined)
    }
  }

  const handleSubmitForm = async (data: BookFormData) => {
    const trimmedData: BookFormData = {
      ...data,
      title: data.title.trim(),
      author: data.author.trim(),
      genre: data.genre.trim(),
      summary: data.summary.trim()
    }

    if (trimmedData.cover_image && !(trimmedData.cover_image instanceof File)) {
      toast.error('A imagem deve ser um arquivo válido.')
      return
    }

    const formData: CreateBookDTO = {
      title: trimmedData.title,
      author: trimmedData.author,
      published_year: trimmedData.published_year,
      genre: trimmedData.genre,
      summary: trimmedData.summary,
      cover_image: trimmedData.cover_image
    }

    try {
      if (bookId) {
        await updateBook(bookId, formData)
      } else {
        await createBook(formData)
      }
      navigate('/books')
    } catch (error) {
      console.error(error)
      handleError(error)
    }
  }

  return (
    <div className="flex space-x-4">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="w-2/3 space-y-4"
      >
        <Input
          label="Título"
          type="text"
          {...register('title')}
          onChange={handleTitleChange}
          error={errors.title?.message}
        />

        <Input
          label="Autor"
          type="text"
          {...register('author')}
          onChange={handleAuthorChange}
          error={errors.author?.message}
        />

        <Input
          label="Ano de Publicação"
          type="number"
          {...register('published_year', { valueAsNumber: true })}
          error={errors.published_year?.message}
        />

        <Input
          label="Gênero"
          type="text"
          {...register('genre')}
          error={errors.genre?.message}
        />

        <TextAreaInput
          label="Resumo"
          {...register('summary', { onChange: handleSummaryChange })}
          error={errors.summary?.message}
          rows={4}
        />

        <Controller
          control={control}
          name="cover_image"
          render={({ field }) => (
            <FileInput
              initialImage={
                imagePreview ||
                (initialData?.cover_image &&
                  typeof initialData.cover_image === 'string'
                  ? initialData.cover_image
                  : undefined)
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!e.target.files?.[0]) {
                  setImagePreview(null)
                  field.onChange(undefined)
                  return
                }
                const file = e.target.files[0]
                setImagePreview(URL.createObjectURL(file))
                field.onChange(file)
              }}
              ref={field.ref}
              error={errors.cover_image?.message?.toString()}
              label="Capa do Livro"
            />
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" isLoading={isSubmitting}>
            {bookId ? 'Salvar Alterações' : 'Criar Livro'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/books')}
          >
            Cancelar
          </Button>
        </div>
      </form>

      <div className="w-1/3 overflow-y-auto max-h-[80vh]">
        <h3 className="text-lg font-semibold mb-2">Sugestões</h3>
        {suggestions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {suggestions.map((sug, index) => (
              <SuggestionCard
                key={index}
                book={sug}
                onSelect={handleSelectSuggestion}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Sem sugestões disponíveis.</p>
        )}
      </div>
    </div>
  )
}
