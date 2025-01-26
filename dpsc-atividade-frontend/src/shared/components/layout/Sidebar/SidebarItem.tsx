import { NavLink } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import { NavigationItem } from '../../../types/navigation.types'

interface SidebarItemProps extends Omit<NavigationItem, 'requiredRoles'> {
  onClick?: () => void
}

export const SidebarItem = ({
  path,
  icon: Icon,
  title,
  exact,
  onClick
}: SidebarItemProps) => {
  return (
    <NavLink
      to={path}
      end={exact}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 p-2 rounded-lg transition-colors',
          isActive
            ? 'bg-surface text-accent'
            : 'hover:bg-surface hover:text-accent text-text-secondary'
        )
      }
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </NavLink>
  )
}
