import telegramIcon from '@/assets/icons/tg.svg'
import vkIcon from '@/assets/icons/vk.svg'
import priceImage from '@/assets/images/price.jpg'

import './price-page.css'

const vkGroupUrl =
  import.meta.env.VITE_VK_GROUP_URL ?? 'https://vk.com/club238903782'

export function PricePage() {
  return (
    <div className="price-page">
      <header className="price-page__hero">
        <div className="price-page__hero-inner">
          <h1>Стоимость и оплата</h1>
        </div>
      </header>

      <main className="price-page__content">
        <figure className="price-page__price-list">
          <img
            src={priceImage}
            alt="Пробное занятие — 250 рублей, разовое занятие — 600 рублей, абонемент на 4 занятия — 2100 рублей, на 8 занятий — 3600 рублей, на 16 занятий — 5800 рублей"
          />
        </figure>

        <section className="price-rules" aria-labelledby="price-rules-title">
          <h2 id="price-rules-title">Система абонементов</h2>
          <div className="price-rules__grid">
            <article className="price-rule-card">
              <h3>30 дней с первого занятия</h3>
              <p>
                Абонемент действует 30 дней с первого занятия — отсчёт
                начинается не с покупки, а когда вы впервые по нему
                позанимались
              </p>
            </article>
            <article className="price-rule-card">
              <h3>Отмена за сутки</h3>
              <p>
                Если планы поменялись, пожалуйста, предупредите нас об отмене
                хотя бы за сутки. При более поздней отмене занятие будет
                считаться использованным
              </p>
            </article>
            <article className="price-rule-card">
              <h3>Продление абонемента</h3>
              <p>
                Заболели или уезжаете? Напишите нам — на время болезни или
                отъезда абонемент можно продлить
              </p>
            </article>
            <article className="price-rule-card">
              <h3>Первое знакомство</h3>
              <p>
                Если вы ещё ни разу не занимались в нашей студии, можно сначала
                прийти на пробное занятие и познакомиться с нами
              </p>
            </article>
          </div>
        </section>

        <aside className="price-page__free-note">
          Открытые уроки всегда бесплатные 💛
        </aside>

        <section className="payment" aria-labelledby="payment-title">
          <article className="payment__details">
            <h2 id="payment-title">Оплата</h2>
            <p>Оплата всегда осуществляется переводом на номер студии</p>
            <a className="payment__phone" href="tel:+79507970050">
              +7 950 797-00-50
            </a>
            <p className="payment__recipient">Получатель: Софья Б</p>
          </article>

          <article className="payment__questions">
            <h2>Остались вопросы?</h2>
            <p>
              Если остались вопросы по оплате или занятиям — пишите нам в
              соцсетях, с радостью ответим!
            </p>
            <div className="payment__socials">
              <a href={vkGroupUrl} target="_blank" rel="noreferrer">
                <span className="payment__social-icon" aria-hidden="true">
                  <img src={vkIcon} alt="" />
                </span>
                Группа в ВК
              </a>
              <a
                href="https://t.me/+v4A3_i0WPWJjMGJi"
                target="_blank"
                rel="noreferrer"
              >
                <span className="payment__social-icon" aria-hidden="true">
                  <img src={telegramIcon} alt="" />
                </span>
                Канал в ТГ
              </a>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
