import { useEffect, useState, type CSSProperties } from "react";

import type { CtaButton } from "@/entities/project/model/cta";
import { fetchCalendarEvents } from "@/entities/project/model/calendar";
import {
  buildCalendarWeeks,
  buildCalendarMonths,
  eventTypeOptions,
  getDayNumber,
  getWeekday,
  parseIsoDate,
  type EventType,
  type ScheduleEvent,
} from "@/entities/project/model/school-info";
import { trackCtaGoal } from "@/shared/lib/metrica";
import telegramIcon from "@/assets/icons/tg.svg";
import vkIcon from "@/assets/icons/vk.svg";
import dancersImage from "@/assets/images/dancers.png";
import { CtaSection } from "@/widgets/cta-list";

import "./home-page.css";

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const mobileWeeksPageSize = 6;
const eventDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const vkGroupUrl =
  import.meta.env.VITE_VK_GROUP_URL ?? "https://vk.com/club238903782";

export function HomePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedType, setSelectedType] = useState<EventType | "all">("all");
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [openMobileWeekKey, setOpenMobileWeekKey] = useState<string | null>(
    null,
  );
  const [visibleMobileWeekCount, setVisibleMobileWeekCount] =
    useState(mobileWeeksPageSize);
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchCalendarEvents()
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
  const visibleMobileWeeks = weeks.slice(0, visibleMobileWeekCount);
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
    setVisibleMobileWeekCount(mobileWeeksPageSize);
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
          <CtaSection variant="hero" />
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
            <a className="about-link about-link--directions" href="/directions">
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
          <div
            className="schedule-state schedule-state--loading"
            role="status"
            aria-label="Загружаем мероприятия"
          >
            <span className="schedule-loader" aria-hidden="true" />
          </div>
        ) : null}

        {status === "error" ? (
          <div className="schedule-state schedule-state--error" role="alert">
            {errorMessage}
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
                    >
                      <span className="calendar-day__number">{day.day}</span>
                      {day.events.map((event) => (
                        <div
                          className={`calendar-day__event calendar-day__event--${event.type} calendar-day__event--accent-${getCalendarEventAccent(event)}`}
                          key={event.id}
                          tabIndex={hasEventDetails(event) ? 0 : undefined}
                        >
                          <span className="calendar-day__label">
                            <strong>{getEventStartTime(event.time)}</strong>
                            <span
                              className="calendar-day__title"
                              title={event.title}
                            >
                              {event.title}
                            </span>
                          </span>
                          {hasEventDetails(event) ? (
                            <EventDetails
                              className={`calendar-day__popover calendar-day__popover--${event.type}`}
                              event={event}
                              showDateTime
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ))}
                  {Array.from(
                    {
                      length:
                        (7 -
                          ((activeMonth.offset + activeMonth.days.length) %
                            7)) %
                        7,
                    },
                    (_, index) => (
                      <span
                        className="calendar-day calendar-day--empty"
                        key={`${activeMonth.key}-trailing-empty-${index}`}
                      />
                    ),
                  )}
                </div>
              </article>
            </div>

            <div
              className="mobile-schedule"
              aria-label="Список событий Dance&Friends"
            >
              {visibleMobileWeeks.map((week) => (
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
                  {week.key === visibleMobileWeekKey ? (
                    <div className="mobile-schedule__events">
                      {week.events.map((event) => {
                        const hasDetails = hasEventDetails(event);
                        const className = `mobile-schedule__event mobile-schedule__event--${event.type}`;

                        return hasDetails ? (
                          <details className={className} key={event.id}>
                            <summary className="mobile-schedule__event-summary">
                              <MobileEventSummary event={event} showMore />
                            </summary>
                            <EventDetails
                              className="mobile-schedule__details"
                              event={event}
                            />
                          </details>
                        ) : (
                          <article className={className} key={event.id}>
                            <div className="mobile-schedule__event-summary">
                              <MobileEventSummary event={event} />
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : null}
                </article>
              ))}
              {visibleMobileWeeks.length < weeks.length ? (
                <button
                  className="mobile-schedule__load-more"
                  type="button"
                  onClick={() =>
                    setVisibleMobileWeekCount(
                      (count) => count + mobileWeeksPageSize,
                    )
                  }
                >
                  Загрузить ещё
                </button>
              ) : null}
            </div>
          </>
        ) : null}
      </section>

      <CtaSection />

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

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

type EventButtonStyle = CSSProperties & {
  "--event-button-color"?: string;
};

function hasEventDetails(event: ScheduleEvent) {
  return Boolean(event.text || event.buttons.length);
}

function getEventStartTime(time: string) {
  return time.split("–", 1)[0];
}

function getCalendarEventAccent(event: ScheduleEvent) {
  if (event.type === "event") {
    return "event";
  }

  const title = event.title.toLocaleLowerCase("ru-RU").replaceAll("ё", "е");

  if (title.includes("линди") || title.includes("lindy")) {
    return "lindy";
  }

  if (title.includes("блюз") || title.includes("blues")) {
    return "blues";
  }

  if (title.includes("бальбоа") || title.includes("balboa")) {
    return "balboa";
  }

  return "class";
}

function MobileEventSummary({
  event,
  showMore = false,
}: {
  event: ScheduleEvent;
  showMore?: boolean;
}) {
  return (
    <>
      <time dateTime={event.date}>
        <strong>{getDayNumber(event.date)}</strong>
        <span>{getWeekday(event.date)}</span>
      </time>
      <span className="mobile-schedule__event-copy">
        <span className="mobile-schedule__event-title">
          <strong>{event.time}</strong> {event.title}
        </span>
        {showMore ? (
          <span className="mobile-schedule__event-more">Подробнее</span>
        ) : null}
      </span>
    </>
  );
}

function EventDetails({
  className,
  event,
  showDateTime = false,
}: {
  className: string;
  event: ScheduleEvent;
  showDateTime?: boolean;
}) {
  return (
    <div
      aria-label={`Подробности: ${event.title}`}
      className={`event-details ${className}`}
      role="region"
    >
      {showDateTime ? (
        <p className="event-details__datetime">
          <strong>
            {eventDateFormatter.format(parseIsoDate(event.date))}, {event.time}
          </strong>
        </p>
      ) : null}
      {event.text ? (
        <p className="event-details__text">
          {renderEventText(event.text, event.type)}
        </p>
      ) : null}
      {event.buttons.length > 0 ? (
        <div className="event-details__actions">
          {event.buttons.map((button) => (
            <EventButton
              button={button}
              key={`${button.label}-${button.link}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EventButton({ button }: { button: CtaButton }) {
  const isExternalLink = /^https?:\/\//i.test(button.link);
  const style: EventButtonStyle | undefined = button.color
    ? { "--event-button-color": button.color }
    : undefined;

  return (
    <a
      className="event-details__button"
      href={button.link}
      onClick={() => trackCtaGoal(button)}
      rel={isExternalLink ? "noreferrer" : undefined}
      style={style}
      target={isExternalLink ? "_blank" : undefined}
    >
      {button.label}
    </a>
  );
}

function renderEventText(text: string, type: EventType) {
  return text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g).map((part, index) => {
    const isDoubleBold = part.startsWith("**") && part.endsWith("**");
    const isBold = isDoubleBold || (part.startsWith("*") && part.endsWith("*"));

    if (!isBold) {
      return part;
    }

    const edgeLength = isDoubleBold ? 2 : 1;

    return (
      <strong
        className={`event-details__highlight event-details__highlight--${type}`}
        key={`${part}-${index}`}
      >
        {part.slice(edgeLength, -edgeLength)}
      </strong>
    );
  });
}
