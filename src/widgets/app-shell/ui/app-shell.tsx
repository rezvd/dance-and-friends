import type { PropsWithChildren } from 'react'

import { AppHeader } from '@/widgets/app-header'

import './app-shell.css'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-shell__main">{children}</main>
    </div>
  )
}
