type ErrorMessageProps = {
  message: string
  onRetry?: () => void
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div
    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <p className="font-bold">Erro</p>
    <p className="text-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
      >
        Tente novamente
      </button>
    )}
  </div>
)
