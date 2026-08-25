import { useEffect, useRef, useState } from 'react'

import closeIcon from '@/assets/icons/close.svg'
import menuIcon from '@/assets/icons/menu.svg'

import './app-header.css'

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const isDirectionsPage = pathname === '/directions'
  const isTeachersPage = pathname === '/teachers'
  const isPricePage = pathname === '/price'
  const isSchedulePage = pathname === '/schedule'
  const isContactsPage = pathname === '/contacts'

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 761px)')
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false)
      }
    }

    desktopMedia.addEventListener('change', handleDesktopChange)

    return () => {
      desktopMedia.removeEventListener('change', handleDesktopChange)
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="app-header" ref={headerRef}>
      <div className="app-header__inner">
        <a className="app-header__brand" href="/" aria-label="Dance&Friends">
          <span>DANCE</span>
          <span className="app-header__ampersand">&amp;</span>
          <span>FRIENDS</span>
        </a>
        <button
          className="app-header__menu-button"
          type="button"
          aria-controls="main-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          ref={menuButtonRef}
        >
          <img src={isMenuOpen ? closeIcon : menuIcon} alt="" />
        </button>
        <nav
          className={
            isMenuOpen
              ? 'app-header__nav app-header__nav--open'
              : 'app-header__nav'
          }
          id="main-navigation"
          aria-label="Основная навигация"
        >
          <a href="/" onClick={closeMenu}>О нас</a>
          <a
            href="/directions"
            aria-current={isDirectionsPage ? 'page' : undefined}
            onClick={closeMenu}
          >
            Направления
          </a>
          <a
            href="/teachers"
            aria-current={isTeachersPage ? 'page' : undefined}
            onClick={closeMenu}
          >
            Преподаватели
          </a>
          <a
            href="/price"
            aria-current={isPricePage ? 'page' : undefined}
            onClick={closeMenu}
          >
            Стоимость
          </a>
          <a
            href="/schedule"
            aria-current={isSchedulePage ? 'page' : undefined}
            onClick={closeMenu}
          >
            Расписание
          </a>
          <a
            href="/contacts"
            aria-current={isContactsPage ? 'page' : undefined}
            onClick={closeMenu}
          >
            Контакты
          </a>
        </nav>
      </div>
    </header>
  )
}
