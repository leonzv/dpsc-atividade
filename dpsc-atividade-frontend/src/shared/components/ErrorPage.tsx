import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate
} from 'react-router-dom'
import { Button } from './Button'

const ErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text-secondary">
          {isRouteErrorResponse(error)
            ? `${error.status} - ${error.statusText}`
            : 'Oops! Algo deu errado'}
        </h1>
        <p className="text-gray-400">
          {isRouteErrorResponse(error) && error.status === 404
            ? 'Página não encontrada'
            : 'Ocorreu um erro inesperado'}
        </p>
        <div className="space-x-4">
          <Button onClick={() => navigate(-1)}>Voltar</Button>
          <Button onClick={() => navigate('/')}>Ir para o início</Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
