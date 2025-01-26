import { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  path: string
  title: string
  icon: LucideIcon
  requiredRoles?: string[]
  exact?: boolean
}

export interface NavigationGroup {
  title: string
  items: NavigationItem[]
}
