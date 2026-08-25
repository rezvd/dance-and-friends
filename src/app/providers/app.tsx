import { useEffect } from 'react'

import { ContactsPage } from '@/pages/contacts'
import { DirectionsPage } from '@/pages/directions'
import { HomePage } from '@/pages/home'
import { PricePage } from '@/pages/price'
import { SchedulePage } from '@/pages/schedule'
import { TeachersPage } from '@/pages/teachers'
import { AppShell } from '@/widgets/app-shell'

export function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const hash = window.location.hash

  useEffect(() => {
    if (!hash) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(
        decodeURIComponent(hash.slice(1)),
      )

      target?.scrollIntoView({ block: 'start' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [hash, pathname])

  const page =
    pathname === '/directions' ? (
      <DirectionsPage />
    ) : pathname === '/teachers' ? (
      <TeachersPage />
    ) : pathname === '/price' ? (
      <PricePage />
    ) : pathname === '/schedule' ? (
      <SchedulePage />
    ) : pathname === '/contacts' ? (
      <ContactsPage />
    ) : (
      <HomePage />
    )

  return (
    <AppShell>
      {page}
    </AppShell>
  )
}
