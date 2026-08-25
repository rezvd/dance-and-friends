import telegramIcon from '@/assets/icons/tg.svg'
import vkIcon from '@/assets/icons/vk.svg'

import './app-footer.css'

const vkGroupUrl =
  import.meta.env.VITE_VK_GROUP_URL ?? 'https://vk.com/club238903782'

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__intro">
          <a className="app-footer__brand" href="/" aria-label="Dance&Friends">
            <span>DANCE</span>
            <span className="app-footer__ampersand">&amp;</span>
            <span>FRIENDS</span>
          </a>
          <p>Сообщество социальных танцев в Омске</p>
        </div>

        <nav className="app-footer__nav" aria-label="Навигация в подвале">
          <a href="/">О нас</a>
          <a href="/directions">Направления</a>
          <a href="/teachers">Преподаватели</a>
          <a href="/price">Стоимость</a>
          <a href="/schedule">Расписание</a>
          <a href="/contacts">Контакты</a>
        </nav>

        <div className="app-footer__socials">
          <a
            className="app-footer__social"
            href={vkGroupUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span className="app-footer__social-icon" aria-hidden="true">
              <img src={vkIcon} alt="" />
            </span>
            <span>Группа в ВК</span>
          </a>
          <a
            className="app-footer__social"
            href="https://t.me/+v4A3_i0WPWJjMGJi"
            target="_blank"
            rel="noreferrer"
          >
            <span className="app-footer__social-icon" aria-hidden="true">
              <img src={telegramIcon} alt="" />
            </span>
            <span>Канал в ТГ</span>
          </a>
        </div>
      </div>

      <div className="app-footer__bottom">
        <span>© {new Date().getFullYear()} Dance&amp;Friends</span>
        <span>Танцуем и общаемся</span>
      </div>
    </footer>
  )
}
