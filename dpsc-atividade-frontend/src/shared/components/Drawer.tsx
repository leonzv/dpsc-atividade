import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

interface DrawerProps {
  children: React.ReactNode
  open: boolean
  onClose: () => void
  title: string
}

export function Drawer({ children, open, onClose, title }: DrawerProps) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full max-w-md bg-background text-text-secondary shadow-xl z-50 transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-surface">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)]">{children}</div>
      </div>
    </>
  )
}
