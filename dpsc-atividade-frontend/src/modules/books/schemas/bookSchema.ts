import { z } from 'zod'

export const bookFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  author: z.string().min(1, 'Autor é obrigatório'),
  published_year: z
    .number()
    .min(1000, 'Ano de publicação inválido')
    .max(new Date().getFullYear(), 'Ano de publicação não pode ser futuro'),
  genre: z.string().min(1, 'Gênero é obrigatório'),
  summary: z.string().min(10, 'Resumo deve ter pelo menos 10 caracteres'),
  cover_image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true
        return ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
      },
      {
        message: 'Apenas arquivos PNG e JPG são permitidos.'
      }
    )
})

export type BookFormData = z.infer<typeof bookFormSchema>
