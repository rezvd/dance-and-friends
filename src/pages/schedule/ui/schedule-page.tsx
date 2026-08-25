import scheduleImage from '@/assets/images/schedule.png'
import { CtaSection } from '@/widgets/cta-list'

import './schedule-page.css'

export function SchedulePage() {
  return (
    <div className="schedule-page">
      <header className="schedule-page__hero">
        <div className="schedule-page__hero-inner">
          <h1>Расписание</h1>
        </div>
      </header>

      <main className="schedule-page__content">
        <aside className="schedule-page__start">
          Старт сезона — 7 сентября 💫
        </aside>

        <figure className="schedule-page__image">
          <img
            src={scheduleImage}
            alt="Расписание занятий с понедельника по пятницу: линди-хоп в 19:00, блюз в 20:00, бальбоа в 18:00, 19:00 и 20:00"
          />
        </figure>

        <section className="schedule-teachers" aria-labelledby="schedule-teachers-title">
          <h2 id="schedule-teachers-title">Наши преподаватели</h2>
          <div className="schedule-teachers__grid">
            <article className="schedule-teacher-card schedule-teacher-card--lindy">
              <h3>Линди-хоп</h3>
              <dl>
                <div>
                  <dt>Начинающие</dt>
                  <dd>Вадим Рябенко и Софья Билль</dd>
                </div>
                <div>
                  <dt>Продолжающие</dt>
                  <dd>Алексей Маловечкин</dd>
                </div>
              </dl>
            </article>

            <article className="schedule-teacher-card schedule-teacher-card--blues">
              <h3>Блюз</h3>
              <dl>
                <div>
                  <dt>Начинающие</dt>
                  <dd>Софья Билль и Илья Пониванов</dd>
                </div>
                <div>
                  <dt>Продолжающие, интенсив</dt>
                  <dd>Юлия Никифорова</dd>
                </div>
              </dl>
            </article>

            <article className="schedule-teacher-card schedule-teacher-card--balboa">
              <h3>Бальбоа</h3>
              <dl>
                <div>
                  <dt>Все группы</dt>
                  <dd>Алексей Маловечкин</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>

        <CtaSection className="schedule-page__cta" />
      </main>
    </div>
  )
}
