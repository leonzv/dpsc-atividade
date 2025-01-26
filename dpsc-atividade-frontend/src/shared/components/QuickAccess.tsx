import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface QuickLinkItem {
  title: string
  description: string
  link: string
  icon: LucideIcon
  color: string
}

interface QuickAccessProps {
  title?: string
  items: QuickLinkItem[]
}

export const QuickAccess = ({ items }: QuickAccessProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.link}
          className="p-6 rounded-lg border border-border bg-background-light hover:border-accent group transition-colors h-full"
        >
          <div className="flex items-start gap-4">
            <div
              className={`${item.color} p-2.5 rounded-lg bg-accent/10 shrink-0`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium text-text flex items-center gap-2">
                {item.title}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                {item.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
