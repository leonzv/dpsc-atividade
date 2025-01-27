import { useNavigate, Link } from 'react-router-dom'
import { Lock, LockOpen, LogOut, Menu, User, X } from 'lucide-react'
import { useState, useRef, useEffect, FC, ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Sidebar } from './Sidebar/Sidebar'
import { useAuth } from '../../../modules/auth/hooks/useAuth'
import { Button } from '../Button'
import { formatApiErrors } from '../../utils/formatApiErrors'

interface LayoutProps {
  children: ReactNode
  showSidebar: boolean
}

export const Layout: FC<LayoutProps> = ({ children, showSidebar }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      const { genericError } = formatApiErrors(err)
      toast.error(genericError)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="h-screen flex flex-col">
      <header className="flex-none h-16 bg-background-light border-b border-surface">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showSidebar && (
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 lg:hidden text-text-secondary hover:text-accent"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
            <Link
              to="/"
              className="text-lg font-semibold text-text hover:text-accent transition-colors"
            >
              Catálogo de Livros
            </Link>
          </div>

          <div>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 text-text-secondary hover:text-accent"
                >
                  <span className="text-sm hidden sm:inline">
                    {user?.username}
                  </span>
                  <User className="h-5 w-5" />
                </Button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background-light rounded-lg shadow-lg py-1 border border-surface z-10">
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm w-full justify-start text-red-500 hover:bg-surface"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="p-2 text-text-secondary hover:text-accent group flex items-center gap-2"
              >
                <div className="relative w-5 h-5">
                  <Lock className="h-5 w-5 absolute transition-all group-hover:opacity-0 group-hover:scale-75" />
                  <LockOpen className="h-5 w-5 absolute transition-all opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
                </div>
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden bg-background-light">
        {showSidebar && (
          <>
            <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            {isMenuOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </>
        )}

        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
