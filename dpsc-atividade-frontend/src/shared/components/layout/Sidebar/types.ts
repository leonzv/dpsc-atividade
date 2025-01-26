import { LucideIcon } from 'lucide-react'

export interface MenuItem {
  path: string
  icon: LucideIcon
  label: string
}

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  items: MenuItem[]
}
