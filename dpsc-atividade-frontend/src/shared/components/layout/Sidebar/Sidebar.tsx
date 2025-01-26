import { FC } from 'react'
import { useNavigation } from '../../../../modules/navigation/hooks/useNavigation'
import { useAuth } from '../../../../modules/auth/hooks/useAuth'
import { SidebarItem } from './SidebarItem'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { groupedNavigationItems } = useNavigation()
  const { token, user } = useAuth()

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-background-light border-r border-surface transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <nav className="h-full py-6 overflow-y-auto">
        {groupedNavigationItems.map((group, index) => (
          <div key={index} className="px-6 mb-8">
            <h2 className="text-sm font-semibold text-text-tertiary mb-3">
              {group.title}
            </h2>
            <div className="flex flex-col gap-1">
              {group.items
                .filter((item) => {
                  if (!token || !user) {
                    return (
                      !item.requiredRoles || item.requiredRoles.length === 0
                    )
                  }
                  if (item.requiredRoles?.includes('admin') && !user.is_staff) {
                    return false
                  }
                  return true
                })
                .map((item) => (
                  <SidebarItem
                    key={item.path}
                    path={item.path}
                    icon={item.icon}
                    title={item.title}
                    exact={item.exact}
                    onClick={onClose}
                  />
                ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
