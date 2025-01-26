import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button } from '../../../shared/components/Button'
import { Input } from '../../../shared/components/Input'
import { useAuth } from '../hooks/useAuth'
import { PasswordInput } from '../../../shared/components/PasswordInput'
import { useFormError } from '../../../shared/hooks/useFormError'

const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Apelido é obrigatório')
      .max(150, 'Apelido deve ter no máximo 150 caracteres')
      .regex(
        /^[\w.@+-]+$/,
        'Apelido deve conter apenas letras, números e @/./+/-/_'
      ),
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Email inválido')
      .max(254, 'Email deve ter no máximo 254 caracteres'),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    password_confirm: z.string().min(1, 'Confirmação de senha é obrigatória')
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Senhas não conferem',
    path: ['password_confirm']
  })

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const { handleError } = useFormError<RegisterFormData>(setError)

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data)
      toast.success('Conta criada com sucesso! Faça login para continuar.')
      navigate('/login', { replace: true })
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1">Apelido</label>
        <Input
          {...register('username')}
          label=""
          type="text"
          placeholder="Digite seu apelido"
        />
        {errors.username && (
          <span className="text-red-500 text-sm">
            {errors.username.message}
          </span>
        )}
      </div>

      <div>
        <Input
          {...register('email')}
          label="Email"
          type="email"
          placeholder="Digite seu email"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
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

      <div>
        <PasswordInput
          label='Confirmar Senha'
          {...register('password_confirm')}
          placeholder="Confirme sua senha"
        />
        {errors.password_confirm && (
          <span className="text-red-500 text-sm">
            {errors.password_confirm.message}
          </span>
        )}
      </div>

      <Button type="submit" className="w-full">
        Criar conta
      </Button>
    </form>
  )
}
