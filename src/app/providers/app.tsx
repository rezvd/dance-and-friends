import { ContactsPage } from '@/pages/contacts'
import { DirectionsPage } from '@/pages/directions'
import { HomePage } from '@/pages/home'
import { PricePage } from '@/pages/price'
import { SchedulePage } from '@/pages/schedule'
import { TeachersPage } from '@/pages/teachers'
import { AppShell } from '@/widgets/app-shell'

export function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
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
