import { Button } from './Button'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  isLoading?: boolean
}

export const Dialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  isLoading
}: DialogProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full m-4">
        <p className="text-gray-800">{title}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="default" isLoading={isLoading}>
            Excluir
          </Button>
        </div>
      </div>
    </div>
  )
}
