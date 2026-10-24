import { useEffect, useState } from "react";

import { schoolContacts } from "@/entities/project/model/contacts";
import telegramIcon from "@/assets/icons/tg.svg";
import vkIcon from "@/assets/icons/vk.svg";
import dancersImage from "@/assets/images/dancers.png";
import { CtaSection } from "@/widgets/cta-list";

import { EventCalendar } from "@/widgets/event-calendar";

import "./home-page.css";

export function HomePage() {
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

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

  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="hero__eyebrow">Сообщество социальных танцев в Омске</p>
          <h1
            id="hero-title"
            className="hero__logo"
            aria-label="Dance&Friends"
          >
            <span>Dance</span>
            <span className="hero__logo-ampersand">&amp;</span>
            <span>Friends</span>
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
          <p>Dance and Friends Omsk — сообщество социальных танцев в Омске</p>
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
            <a className="about-link about-link--directions" href="/directions/">
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
            <a className="about-link about-link--teachers" href="/teachers/">
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
          <h2 id="schedule-title">Занятия и мероприятия</h2>
        </div>

        <EventCalendar />
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
              href={schoolContacts.vkUrl}
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
              href={schoolContacts.telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-card__icon" aria-hidden="true">
                <img src={telegramIcon} alt="" />
              </span>
              <strong>Канал в ТГ</strong>
            </a>
            <span className="contact-card__social-link contact-card__handle">
              <strong>{schoolContacts.socialHandle}</strong>
            </span>
          </div>
          <div className="contact-card contact-card--person">
            <span>
              <strong>Телефон студии</strong>
              <a href={schoolContacts.phoneUrl}>{schoolContacts.phoneLabel}</a>
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
