import { FC, ReactNode } from 'react'
import { Layout } from './Layout'

interface BaseLayoutProps {
  children: ReactNode
}

export const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return <Layout showSidebar={true}>{children}</Layout>
}
