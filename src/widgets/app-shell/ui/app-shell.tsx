import type { PropsWithChildren } from 'react'

import { AppFooter } from '@/widgets/app-footer'
import { AppHeader } from '@/widgets/app-header'

import './app-shell.css'

export function AppShell({ children, pathname }: PropsWithChildren<{ pathname: string }>) {
  return (
    <div className="app-shell">
      <AppHeader pathname={pathname} />
      <main className="app-shell__main">{children}</main>
      <AppFooter />
    </div>
  )
}
