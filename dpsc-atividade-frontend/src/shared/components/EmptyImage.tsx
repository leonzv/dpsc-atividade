import React from 'react'

export const EmptyImage: React.FC = () => {
  return (
    <div className="w-full h-full aspect-[3/4] flex items-center justify-center bg-gray-200">
      <p className="text-gray-500">Sem imagem</p>
    </div>
  )
}
