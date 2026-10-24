import { useEffect } from 'react'

import { ContactsPage } from '@/pages/contacts'
import { DirectionsPage } from '@/pages/directions'
import { HomePage } from '@/pages/home'
import { PricePage } from '@/pages/price'
import { SchedulePage } from '@/pages/schedule'
import { TeachersPage } from '@/pages/teachers'
import { AppShell } from '@/widgets/app-shell'

export function App({ pathname: requestedPath }: { pathname: string }) {
  const pathname = requestedPath.replace(/\/+$/, '') || '/'

  useEffect(() => {
    const hash = window.location.hash
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
  }, [pathname])

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
    <AppShell pathname={pathname}>
      {page}
    </AppShell>
  )
}
