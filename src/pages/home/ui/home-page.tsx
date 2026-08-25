import { useEffect, useState } from "react";

import {
  buildCalendarWeeks,
  buildCalendarMonths,
  eventTypeOptions,
  getDayNumber,
  getWeekday,
  type EventType,
  type ScheduleEvent,
} from "@/entities/project/model/school-info";
import { fetchScheduleEvents } from "@/entities/project/model/sheets";
import { Button } from "@/shared/ui/button";
import telegramIcon from "@/assets/icons/tg.svg";
import vkIcon from "@/assets/icons/vk.svg";
import dancersImage from "@/assets/images/dancers.png";

import "./home-page.css";

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const vkGroupUrl =
  import.meta.env.VITE_VK_GROUP_URL ?? "https://vk.com/club238903782";

export function HomePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedType, setSelectedType] = useState<EventType | "all">("all");
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [openMobileWeekKey, setOpenMobileWeekKey] = useState<string | null>(
    null,
  );
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchScheduleEvents()
      .then((nextEvents) => {
        if (cancelled) {
          return;
        }

        setEvents(nextEvents);
        setStatus("ready");
        setErrorMessage("");
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Не удалось загрузить расписание. Попробуйте позже",
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEvents =
    selectedType === "all"
      ? events
      : events.filter((event) => event.type === selectedType);
  const months = buildCalendarMonths(filteredEvents);
  const weeks = buildCalendarWeeks(filteredEvents);
  const visibleMobileWeekKey = openMobileWeekKey ?? weeks[0]?.key ?? "";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollTopVisible(window.scrollY > 480);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const activeMonth = months[activeMonthIndex];
  const isFirstMonth = activeMonthIndex === 0;
  const isLastMonth = activeMonthIndex === months.length - 1;

  const selectEventType = (nextType: EventType | "all") => {
    setSelectedType(nextType);
    setActiveMonthIndex(0);
    setOpenMobileWeekKey(null);
  };

  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="hero__eyebrow">Сообщество социальных танцев в Омске</p>
          <h1
            id="hero-title"
            className="hero__logo"
            aria-label="Dance and Friends"
          >
            <span>DANCE</span>
            <span className="hero__logo-ampersand">&amp;</span>
            <span>FRIENDS</span>
          </h1>
          <p className="hero__lead">
            Линди хоп, блюз и бальбоа для тех, кто хочет чаще танцевать,
            знакомиться и проводить время в тёплом комьюнити
          </p>
          <div className="hero__actions">
            <Button type="button" onClick={() => scrollToSection("contacts")}>
              Написать нам
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={openDirectionsPage}
            >
              Смотреть направления
            </Button>
          </div>
        </div>
        <div className="hero__aside" aria-hidden="true">
          <img className="hero__dancers" src={dancersImage} alt="" />
        </div>
      </section>

      <section
        className="section about"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="section__header">
          <p className="section__eyebrow">О нас</p>
          <h2 id="about-title">
            Dance&Friends
            <span className="about__title-subline">
              строится вокруг <span className="about__title-accent">людей</span>
              ,<br />а не шагов
            </span>
          </h2>
        </div>
        <div className="about__grid">
          <article className="about-card">
            <h3>Начать легко</h3>
            <p>
              К нам можно прийти совсем без опыта и без пары — всему остальному
              научимся вместе
            </p>
          </article>
          <article className="about-card">
            <h3>Встречаемся чаще</h3>
            <p>
              Практики, вечеринки, опен-эйры, фестивали — для нас танцы не
              заканчиваются в классе
            </p>
          </article>
          <article className="about-card">
            <h3>Здесь свои люди</h3>
            <p>
              Мы хотим, чтобы сюда приходили не только потанцевать, но и увидеть
              тех, с кем хочется остаться после занятия
            </p>
          </article>
        </div>
        <section className="about-more" aria-labelledby="about-more-title">
          <h2 id="about-more-title">Направления и преподаватели</h2>
          <nav className="about-links" aria-label="Подробнее о Dance&Friends">
            <a
              className="about-link about-link--directions"
              href="/directions"
            >
              <span className="about-link__copy">
                <strong>Направления</strong>
                <span>
                  Линди-хоп, блюз или бальбоа? Рассказываем, чем они отличаются
                  и как выбрать свой танец
                </span>
              </span>
              <span className="about-link__arrow" aria-hidden="true">
                &gt;
              </span>
            </a>
            <a className="about-link about-link--teachers" href="/teachers">
              <span className="about-link__copy">
                <strong>Преподаватели</strong>
                <span>
                  Знакомьтесь с теми, кто поможет сделать первые шаги и найти
                  свой стиль в танце
                </span>
              </span>
              <span className="about-link__arrow" aria-hidden="true">
                &gt;
              </span>
            </a>
          </nav>
        </section>
      </section>

      <section
        className="section schedule"
        id="schedule"
        aria-labelledby="schedule-title"
      >
        <div className="section__header">
          <p className="section__eyebrow">Мероприятия</p>
          <h2 id="schedule-title">Ближайшие занятия и мероприятия</h2>
          <p>
            Фильтруйте занятия и мероприятия. На мобильных показываем расписание
            блоками по две недели
          </p>
        </div>

        <div className="schedule-filters" aria-label="Фильтр по типу событий">
          {eventTypeOptions.map((option) => (
            <button
              className={
                option.value === selectedType
                  ? `schedule-filter schedule-filter--${option.value} schedule-filter--active`
                  : `schedule-filter schedule-filter--${option.value}`
              }
              key={option.value}
              type="button"
              onClick={() => selectEventType(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {status === "loading" ? (
          <div className="schedule-state" role="status">
            Загружаем мероприятия из Google Sheets
          </div>
        ) : null}

        {status === "error" ? (
          <div className="schedule-state schedule-state--error" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {status === "ready" && months.length === 0 ? (
          <div className="schedule-state" role="status">
            В таблице пока нет ближайших мероприятий
          </div>
        ) : null}

        {status === "ready" && months.length > 0 ? (
          <>
            <div className="calendar-controls" aria-label="Переключение месяца">
              <button
                className="calendar-button"
                type="button"
                onClick={() =>
                  setActiveMonthIndex((index) => Math.max(0, index - 1))
                }
                disabled={isFirstMonth}
                aria-label="Предыдущий месяц"
              >
                <span className="calendar-button__arrow" aria-hidden="true">
                  ‹
                </span>
              </button>
              <span>{activeMonth.title}</span>
              <button
                className="calendar-button"
                type="button"
                onClick={() =>
                  setActiveMonthIndex((index) =>
                    Math.min(months.length - 1, index + 1),
                  )
                }
                disabled={isLastMonth}
                aria-label="Следующий месяц"
              >
                <span className="calendar-button__arrow" aria-hidden="true">
                  ›
                </span>
              </button>
            </div>

            <div
              className="calendar"
              aria-label="Календарь событий Dance&Friends"
            >
              <article className="calendar-month" key={activeMonth.key}>
                <h3>{activeMonth.title}</h3>
                <div className="calendar-month__title">{activeMonth.title}</div>
                <div className="calendar-month__weekdays" aria-hidden="true">
                  {weekdays.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="calendar-month__grid">
                  {Array.from({ length: activeMonth.offset }, (_, index) => (
                    <span
                      className="calendar-day calendar-day--empty"
                      key={`${activeMonth.key}-empty-${index}`}
                    />
                  ))}
                  {activeMonth.days.map((day) => (
                    <div
                      className={
                        day.events.length > 0
                          ? `calendar-day calendar-day--event calendar-day--type-${day.events[0].type}`
                          : "calendar-day"
                      }
                      key={`${activeMonth.key}-${day.day}`}
                      tabIndex={day.events.length > 0 ? 0 : undefined}
                    >
                      <span className="calendar-day__number">{day.day}</span>
                      {day.events.map((event) => (
                        <span
                          className={`calendar-day__event calendar-day__event--${event.type}`}
                          key={event.title + event.time}
                        >
                          <span className="calendar-day__label">
                            <strong>{event.time}</strong>
                            <span className="calendar-day__title">
                              {event.title}
                            </span>
                          </span>
                          <span
                            className={`calendar-day__tooltip calendar-day__tooltip--${event.type}`}
                            role="tooltip"
                          >
                            {event.title}
                            <small>{event.description}</small>
                          </span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div
              className="mobile-schedule"
              aria-label="Список событий Dance&Friends"
            >
              {weeks.map((week) => (
                <article
                  className={
                    week.key === visibleMobileWeekKey
                      ? "mobile-schedule__month mobile-schedule__month--open"
                      : "mobile-schedule__month"
                  }
                  key={week.key}
                >
                  <button
                    className="mobile-schedule__summary"
                    type="button"
                    aria-expanded={week.key === visibleMobileWeekKey}
                    onClick={() =>
                      setOpenMobileWeekKey(
                        visibleMobileWeekKey === week.key ? "" : week.key,
                      )
                    }
                  >
                    <span>{week.title}</span>
                    <span className="mobile-schedule__arrow" aria-hidden="true">
                      ›
                    </span>
                  </button>
                  <div className="mobile-schedule__events">
                    {week.events.map((event) => (
                      <article
                        className={`mobile-schedule__event mobile-schedule__event--${event.type}`}
                        key={`${event.date}-${event.time}-${event.title}`}
                      >
                        <time dateTime={event.date}>
                          <strong>{getDayNumber(event.date)}</strong>
                          <span>{getWeekday(event.date)}</span>
                        </time>
                        <div>
                          <p>
                            <strong>{event.time}</strong> {event.title}
                          </p>
                          <small>{event.description}</small>
                        </div>
                      </article>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </section>

      <section className="contacts" id="contacts" aria-label="Контакты">
        <div className="contacts__intro">
          <p className="section__eyebrow">Контакты</p>
          <p>
            Пишите, если хотите прийти впервые, уточнить формат встречи или
            задать вопрос
          </p>
        </div>
        <div className="contacts__cards">
          <div className="contact-card contact-card--socials">
            <a
              className="contact-card__social-link contact-card__social-link--vk"
              href={vkGroupUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-card__icon" aria-hidden="true">
                <img src={vkIcon} alt="" />
              </span>
              <strong>Группа в ВК</strong>
            </a>
            <a
              className="contact-card__social-link contact-card__social-link--telegram"
              href="https://t.me/+v4A3_i0WPWJjMGJi"
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-card__icon" aria-hidden="true">
                <img src={telegramIcon} alt="" />
              </span>
              <strong>Канал в ТГ</strong>
            </a>
          </div>
          <div className="contact-card contact-card--person">
            <span>
              <strong>Софья Билль</strong>
              <a href="tel:+79136143226">+7 913 614-32-26</a>
              <a href="mailto:bill_03@mail.ru">bill_03@mail.ru</a>
            </span>
          </div>
        </div>
      </section>

      {isScrollTopVisible ? (
        <button
          className="scroll-top-button"
          type="button"
          aria-label="Наверх"
          onClick={scrollToTop}
        >
          ↑
        </button>
      ) : null}
    </div>
  );
}

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openDirectionsPage() {
  window.location.assign("/directions");
}
