import { useState } from 'react'

import {
  calendarMonths,
  directions,
  scheduleEvents,
} from '@/entities/project/model/school-info'
import { Button } from '@/shared/ui/button'

import './home-page.css'

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const mobileScheduleMonths = calendarMonths.map((month) => ({
  title: month.title,
  events: scheduleEvents.filter((event) => getMonthTitle(event.date) === month.title),
}))

const defaultMobileMonthTitle =
  mobileScheduleMonths.find((month) => month.title === getMonthTitleFromDate(new Date()))
    ?.title ?? mobileScheduleMonths[0]?.title

export function HomePage() {
  const [activeMonthIndex, setActiveMonthIndex] = useState(0)
  const [openMobileMonthTitle, setOpenMobileMonthTitle] = useState(
    defaultMobileMonthTitle,
  )
  const activeMonth = calendarMonths[activeMonthIndex]
  const isFirstMonth = activeMonthIndex === 0
  const isLastMonth = activeMonthIndex === calendarMonths.length - 1

  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="hero__eyebrow">Школа социальных танцев в Омске</p>
          <h1 id="hero-title">Jazz Time</h1>
          <p className="hero__lead">
            Линди хоп, блюз, бальбоа и соло джаз для тех, кто хочет танцевать
            под свинг, находить своих людей и чаще встречаться на паркете.
          </p>
          <div className="hero__actions">
            <Button type="button" onClick={() => scrollToSection('contacts')}>
              Записаться на занятие
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => scrollToSection('schedule')}
            >
              Смотреть расписание
            </Button>
          </div>
        </div>
      </section>

      <section className="section" id="directions" aria-labelledby="directions-title">
        <div className="section__header">
          <p className="section__eyebrow">Направления</p>
          <h2 id="directions-title">Танцы, музыка и практика</h2>
        </div>
        <div className="directions">
          {directions.map((direction) => (
            <article className="direction-card" key={direction.title}>
              <h3>{direction.title}</h3>
              <p>{direction.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section about" id="about" aria-labelledby="about-title">
        <div className="section__header">
          <p className="section__eyebrow">О школе</p>
          <h2 id="about-title">Тёплое сообщество вокруг джаза</h2>
        </div>
        <div className="about__grid">
          <p>
            Jazz Time — это школа социальных танцев, где важны не только шаги,
            но и люди. Мы собираем тёплое сообщество: поддерживаем новичков,
            много смеёмся на занятиях и устраиваем весёлые вечеринки.
          </p>
          <p>
            Мы встречаемся не только в классе: гуляем, проводим время вместе
            вне школы, ездим на фестивали в другие города, устраиваем
            опен-эйры и вечеринки, а ещё ходим танцевать под живую музыку в
            городе.
          </p>
          <p>
            Постоянные занятия откроются в сентябре 2026 года в своём зале.
            До конца лета встречаемся на самоподготовках, специальных
            практиках и открытых танцевальных событиях.
          </p>
        </div>
      </section>

      <section className="section schedule" id="schedule" aria-labelledby="schedule-title">
        <div className="section__header">
          <p className="section__eyebrow">Расписание</p>
          <h2 id="schedule-title">Май — июль 2026</h2>
        </div>

        <div className="calendar-controls" aria-label="Переключение месяца">
          <button
            className="calendar-button"
            type="button"
            onClick={() => setActiveMonthIndex((index) => Math.max(0, index - 1))}
            disabled={isFirstMonth}
            aria-label="Предыдущий месяц"
          >
            <span className="calendar-button__arrow" aria-hidden="true">
              ›
            </span>
          </button>
          <span>{activeMonth.title}</span>
          <button
            className="calendar-button"
            type="button"
            onClick={() =>
              setActiveMonthIndex((index) => Math.min(calendarMonths.length - 1, index + 1))
            }
            disabled={isLastMonth}
            aria-label="Следующий месяц"
          >
            <span className="calendar-button__arrow" aria-hidden="true">
              ›
            </span>
          </button>
        </div>

        <div className="calendar" aria-label="Календарь событий Jazz Time">
          <article className="calendar-month" key={activeMonth.title}>
            <h3>{activeMonth.title}</h3>
            <div className="calendar-month__weekdays" aria-hidden="true">
              {weekdays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="calendar-month__grid">
              {Array.from({ length: activeMonth.offset }, (_, index) => (
                <span
                  className="calendar-day calendar-day--empty"
                  key={`${activeMonth.title}-empty-${index}`}
                />
              ))}
              {activeMonth.days.map((day) => (
                <div
                  className={
                    day.events.length > 0
                      ? 'calendar-day calendar-day--event'
                      : 'calendar-day'
                  }
                  key={`${activeMonth.title}-${day.day}`}
                  tabIndex={day.events.length > 0 ? 0 : undefined}
                >
                  <span className="calendar-day__number">{day.day}</span>
                  {day.events.map((event) => (
                    <span className="calendar-day__event" key={event.title + event.time}>
                      <span className="calendar-day__label">
                        <strong>{event.time}</strong>
                        <span className="calendar-day__title">{event.title}</span>
                      </span>
                      <span className="calendar-day__tooltip" role="tooltip">
                        {event.href ? (
                          <a href={event.href} target="_blank" rel="noreferrer">
                            {event.title}
                          </a>
                        ) : (
                          event.title
                        )}
                        <small>{event.description}</small>
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mobile-schedule" aria-label="Список событий Jazz Time">
          {mobileScheduleMonths.map((month) => (
            <article
              className={
                month.title === openMobileMonthTitle
                  ? 'mobile-schedule__month mobile-schedule__month--open'
                  : 'mobile-schedule__month'
              }
              key={month.title}
            >
              <button
                className="mobile-schedule__summary"
                type="button"
                aria-expanded={month.title === openMobileMonthTitle}
                onClick={() =>
                  setOpenMobileMonthTitle((currentTitle) =>
                    currentTitle === month.title ? '' : month.title,
                  )
                }
              >
                <span>{month.title}</span>
                <span className="mobile-schedule__arrow" aria-hidden="true">
                  ›
                </span>
              </button>
              <div className="mobile-schedule__events">
                {month.events.map((event) => (
                  <article className="mobile-schedule__event" key={`${event.date}-${event.title}`}>
                    <time dateTime={event.date}>
                      <strong>{getDayNumber(event.date)}</strong>
                      <span>{getWeekday(event.date)}</span>
                    </time>
                    <div>
                      <p>
                        <strong>{event.time}</strong>{' '}
                        {event.href ? (
                          <a href={event.href} target="_blank" rel="noreferrer">
                            {event.title}
                          </a>
                        ) : (
                          event.title
                        )}
                      </p>
                      <small>{event.description}</small>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contacts" id="contacts" aria-label="Контакты">
        <div className="contacts__intro">
          <p className="section__eyebrow">Контакты</p>
          <p>Напишите, чтобы уточнить расписание, формат практики или прийти впервые.</p>
        </div>
        <div className="contacts__cards">
          <a
            className="contact-card contact-card--vk"
            href="https://vk.com/jazztimeomsk"
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-card__icon" aria-hidden="true">
              VK
            </span>
            <span>
              <strong>Группа Jazz Time</strong>
              <small>Новости, анонсы и обсуждения</small>
            </span>
          </a>
          <div className="contact-card contact-card--person">
            <span>
              <strong>Софья Билль</strong>
              <a href="tel:+79136143226">+7 913 614-32-26</a>
              <a href="mailto:bill_03@mail.ru">bill_03@mail.ru</a>
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function getDate(date: string) {
  return new Date(`${date}T12:00:00+06:00`)
}

function getMonthTitle(date: string) {
  return getMonthTitleFromDate(getDate(date))
}

function getMonthTitleFromDate(parsedDate: Date) {
  const month = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(parsedDate)
  return `${capitalize(month)} ${parsedDate.getFullYear()}`
}

function getDayNumber(date: string) {
  return getDate(date).getDate()
}

function getWeekday(date: string) {
  return new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
    .format(getDate(date))
    .replace('.', '')
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
