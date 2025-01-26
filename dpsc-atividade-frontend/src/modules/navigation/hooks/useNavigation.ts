import { useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { navigationConfig } from '../config/navigationItems'
import { NavigationItem } from '../../../shared/types/navigation.types'

export const useNavigation = () => {
  const { pathname } = useLocation()
  const { user } = useAuth()

  const filterNavigationItems = (items: NavigationItem[]) => {
    return items.filter((item) => {
      if (!item.requiredRoles) return true
      return item.requiredRoles.some((role) => {
        if (role === 'admin') return user?.is_staff
        return user?.roles?.includes(role)
      })
    })
  }

  const flattenedItems = navigationConfig.flatMap((group) =>
    filterNavigationItems(group.items)
  )

  const groupedItems = navigationConfig.map((group) => ({
    ...group,
    items: filterNavigationItems(group.items)
  }))

  return {
    navigationItems: flattenedItems,
    groupedNavigationItems: groupedItems,
    currentPath: pathname
  }
}
