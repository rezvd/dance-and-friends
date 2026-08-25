import './app-header.css'

export function AppHeader() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const isHomePage = pathname === '/'
  const isDirectionsPage = pathname === '/directions'
  const isTeachersPage = pathname === '/teachers'
  const isPricePage = pathname === '/price'
  const isSchedulePage = pathname === '/schedule'
  const isContactsPage = pathname === '/contacts'

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <a className="app-header__brand" href="/" aria-label="Dance&Friends">
          <span>DANCE</span>
          <span className="app-header__ampersand">&amp;</span>
          <span>FRIENDS</span>
        </a>
        <nav className="app-header__nav" aria-label="Main navigation">
          <a href={isHomePage ? '#about' : '/#about'}>О нас</a>
          <a
            href="/directions"
            aria-current={isDirectionsPage ? 'page' : undefined}
          >
            Направления
          </a>
          <a
            href="/teachers"
            aria-current={isTeachersPage ? 'page' : undefined}
          >
            Преподаватели
          </a>
          <a href="/price" aria-current={isPricePage ? 'page' : undefined}>
            Стоимость
          </a>
          <a
            href="/schedule"
            aria-current={isSchedulePage ? 'page' : undefined}
          >
            Расписание
          </a>
          <a
            href="/contacts"
            aria-current={isContactsPage ? 'page' : undefined}
          >
            Контакты
          </a>
        </nav>
      </div>
    </header>
  )
}
