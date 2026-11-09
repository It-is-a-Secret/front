import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

export function Layout({ children }: AppLayoutProps) {
  return (
    <main className="px-[2rem]">
      {children}
    </main>
  )
}