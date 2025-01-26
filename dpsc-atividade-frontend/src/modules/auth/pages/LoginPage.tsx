import { LoginForm } from '../components/LoginForm'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-text mb-8">
          Entre na sua conta
        </h2>
        <LoginForm />
        <p className="text-center mt-4 text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-accent hover:text-accent-hover">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
