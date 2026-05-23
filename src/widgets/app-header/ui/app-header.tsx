import './app-header.css'

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <a className="app-header__brand" href="/" aria-label="Dance&Friends">
          <span>DANCE</span>
          <span className="app-header__ampersand">&amp;</span>
          <span>FRIENDS</span>
        </a>
        <nav className="app-header__nav" aria-label="Main navigation">
          <a href="#directions">Направления</a>
          <a href="#about">О нас</a>
          <a href="#schedule">Мероприятия</a>
          <a href="#contacts">Контакты</a>
        </nav>
      </div>
    </header>
  )
}
