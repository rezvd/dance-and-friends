import { ThemeToggle } from '@/features/theme-toggle'

import './app-header.css'

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <a className="app-header__brand" href="/" aria-label="Jazz Time">
          Jazz Time
        </a>
        <nav className="app-header__nav" aria-label="Main navigation">
          <a href="#stack">Stack</a>
          <a href="#structure">Structure</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
