import { RegisterForm } from '../components/RegisterForm'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-text mb-8">
          Criar uma conta
        </h2>
        <RegisterForm />
        <p className="text-center mt-4 text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
