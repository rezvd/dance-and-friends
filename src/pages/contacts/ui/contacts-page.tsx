import telegramIcon from '@/assets/icons/tg.svg'
import vkIcon from '@/assets/icons/vk.svg'
import planImage from '@/assets/images/plan.jpg'
import { CtaSection } from '@/widgets/cta-list'

import './contacts-page.css'

const vkGroupUrl =
  import.meta.env.VITE_VK_GROUP_URL ?? 'https://vk.com/club238903782'

export function ContactsPage() {
  return (
    <div className="contacts-page">
      <header className="contacts-page__hero">
        <div className="contacts-page__hero-inner">
          <h1>Контакты</h1>
        </div>
      </header>

      <main className="contacts-page__content">
        <section className="venue" aria-labelledby="venue-title">
          <div className="venue__details">
            <div className="contacts-socials" aria-label="Социальные сети">
              <p className="contacts-socials__text">
                Если остались вопросы — пишите нам в соцсетях, с радостью
                ответим!
              </p>
              <a
                className="contacts-social-card"
                href={vkGroupUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span
                  className="contacts-social-card__icon"
                  aria-hidden="true"
                >
                  <img src={vkIcon} alt="" />
                </span>
                <span>Группа в ВК</span>
              </a>
              <a
                className="contacts-social-card"
                href="https://t.me/+v4A3_i0WPWJjMGJi"
                target="_blank"
                rel="noreferrer"
              >
                <span
                  className="contacts-social-card__icon"
                  aria-hidden="true"
                >
                  <img src={telegramIcon} alt="" />
                </span>
                <span>Канал в ТГ</span>
              </a>
            </div>

            <article className="venue__info">
              <h2 id="venue-title">Как нас найти</h2>
              <p className="venue__studio">Занимаемся в студии Mad Family</p>
              <address>
                <strong>Адрес</strong>
                <span>г. Омск, ул. Гагарина, 8/2, 4 этаж</span>
              </address>
              <p className="venue__transport">
                🚌 Ближайшая остановка — «Дом туриста»
              </p>
            </article>
          </div>

          <div className="venue__map">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=73.3788%2C54.986553&mode=search&oid=69649165094&ol=biz&z=17"
              title="Mad Family на Яндекс Картах"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <section className="venue-plan" aria-labelledby="venue-plan-title">
          <h2 id="venue-plan-title">План залов</h2>
          <div className="venue-plan__content">
            <div className="venue-plan__copy">
              <p>
                В студии несколько залов, поэтому перед занятием обязательно
                проверяйте расписание — в нём будет указан нужный зал
              </p>
              <p>А найти его вам поможет наш план!</p>
            </div>
            <figure>
              <img
                src={planImage}
                alt="Схема залов студии Mad Family на четвёртом этаже"
              />
            </figure>
          </div>
        </section>

        <CtaSection className="contacts-page__cta" />
      </main>
    </div>
  )
}
