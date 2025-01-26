import { Construction } from 'lucide-react'

const WipScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-text-secondary">
      <Construction className="w-16 h-16 mb-4 text-accent animate-bounce" />
      <h2 className="text-2xl font-semibold mb-2">Tela em construção...</h2>
      <p className="text-lg">Mantenha distância de 5 metros das obras</p>
    </div>
  )
}

export default WipScreen
