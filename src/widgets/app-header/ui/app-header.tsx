import './app-header.css'

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <a className="app-header__brand" href="/" aria-label="Jazz Time">
          Jazz Time
        </a>
        <nav className="app-header__nav" aria-label="Main navigation">
          <a href="#directions">Направления</a>
          <a href="#about">О школе</a>
          <a href="#schedule">Расписание</a>
          <a href="#contacts">Контакты</a>
        </nav>
      </div>
    </header>
  )
}
