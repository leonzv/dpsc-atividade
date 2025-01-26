import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../shared/components/Button'
import { Input } from '../../../shared/components/Input'
import { ErrorMessage } from '../../../shared/components/ErrorMessage'
import { useAuth } from '../hooks/useAuth'
import { PasswordInput } from '../../../shared/components/PasswordInput'
import { useFormError } from '../../../shared/hooks/useFormError'

const loginSchema = z.object({
  login: z
    .string()
    .min(3, 'Login deve ter no mínimo 3 caracteres')
    .transform((val) => (val.includes('@') ? val.toLowerCase() : val)),
  password: z.string().min(6, 'Senha deve ter no mínimo 8 caracteres')
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const { login, error } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })
  const { handleError } = useFormError<LoginFormData>(setError)

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      navigate('/books', { replace: true })
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div>
        <Input
          {...register('login')}
          type="text"
          placeholder="Digite seu email ou apelido"
          label="Email ou Apelido"
        />
        {errors.login && (
          <span className="text-red-500 text-sm">{errors.login.message}</span>
        )}
      </div>

      <div>
        <PasswordInput
          label='Senha'
          {...register('password')}
          placeholder="Digite sua senha"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      <Button type="submit" className="w-full">
        Entrar
      </Button>
    </form>
  )
}
