interface SidebarOverlayProps {
  isVisible: boolean
  onClick: () => void
}

export const SidebarOverlay = ({ isVisible, onClick }: SidebarOverlayProps) => {
  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={onClick}
    />
  )
}
