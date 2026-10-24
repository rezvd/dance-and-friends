import type { ReactNode } from 'react'

import { schoolContacts } from '@/entities/project/model/contacts'

import './faq-page.css'

const questions: Array<{ id: string; question: string; answer: ReactNode }> = [
  {
    id: 'experience',
    question: '💃 Можно ли прийти без танцевального опыта?',
    answer: (
      <p>
        Конечно! У нас есть группы для начинающих с нуля, поэтому никакая
        специальная подготовка не нужна. Всему необходимому научим на занятиях
      </p>
    ),
  },
  {
    id: 'partner',
    question: '👫 Нужна ли своя пара?',
    answer: (
      <p>
        Нет! На занятиях мы меняемся партнёрами, поэтому можно спокойно приходить
        самостоятельно. Но если хотите привести друга или подругу — будем только
        рады :)
      </p>
    ),
  },
  {
    id: 'clothes',
    question: '👟 Что надеть на занятие?',
    answer: (
      <>
        <p>Самое главное — чтобы вам было удобно!</p>
        <p>
          Обычно мы танцуем в повседневной одежде: джинсах, брюках, юбках,
          футболках или рубашках
        </p>
        <p>
          Для начала подойдут кеды или кроссовки. Желательно, чтобы подошва
          немного скользила по ламинату — так танцевать будет комфортнее
        </p>
      </>
    ),
  },
  {
    id: 'direction',
    question: '🎷 Как выбрать направление?',
    answer: (
      <>
        <p>
          У нас три направления: линди-хоп, блюз и бальбоа. У каждого свой
          характер, музыка и настроение
        </p>
        <p>
          Почитать о различиях и посмотреть видео можно{' '}
          <a href="/directions/">
            в нашей статье
          </a>
        </p>
        <p>
          А ещё можно попробовать разные направления на пробных занятиях и
          выбрать то, что понравится больше
        </p>
      </>
    ),
  },
  {
    id: 'trial',
    question: '🎟 Можно ли сначала попробовать?',
    answer: (
      <>
        <p>
          Да! Для тех, кто ещё не занимался в нашей студии, первое пробное
          занятие стоит 250 ₽
        </p>
        <p>
          Необязательно сразу покупать абонемент — сначала можно познакомиться
          с преподавателями, попробовать танец и понять, хочется ли продолжать
        </p>
      </>
    ),
  },
  {
    id: 'joining',
    question: '📅 Можно ли присоединиться к группе не с первого занятия?',
    answer: (
      <>
        <p>Обычно да, особенно если группа стартовала совсем недавно</p>
        <p>
          <a href="/contacts/">Напишите</a> нам, какое направление вас интересует,
          {' '}— подскажем, можно ли
          присоединиться сейчас и как лучше это сделать
        </p>
      </>
    ),
  },
  {
    id: 'subscription',
    question: '⏳ Сколько действует абонемент?',
    answer: (
      <>
        <p>
          30 дней с первого занятия. То есть отсчёт начинается не с момента
          покупки, а с первого посещения по абонементу
        </p>
        <p>
          Если заболели или уезжаете, напишите нам — абонемент можно продлить
        </p>
      </>
    ),
  },
  {
    id: 'registration',
    question: '📝 Как записаться?',
    answer: (
      <>
        <p>
          Заполните <a href="https://forms.gle/wGiSuFbwPTGG2pvj7">небольшую форму</a>
        </p>
        <p>
          Мы увидим вашу заявку и свяжемся с вами, чтобы уточнить детали
        </p>
        <p>
          Кроме этого, вы можете просто написать нам{' '}
          <a href="/contacts/">в любой соцсети</a>
        </p>
      </>
    ),
  },
]

const columnBreak = Math.ceil(questions.length / 2)
const questionColumns = [questions.slice(0, columnBreak), questions.slice(columnBreak)]

export function FaqPage() {
  return (
    <div className="faq-page">
      <header className="faq-page__hero">
        <div className="faq-page__hero-inner">
          <h1>Частые вопросы</h1>
        </div>
      </header>

      <main className="faq-page__content">
        <div className="faq-page__list">
          {questionColumns.map((column) => (
            <div className="faq-page__column" key={column[0].id}>
              {column.map(({ id, question, answer }) => (
                <details className="faq-item" key={id}>
                  <summary className="faq-item__question">
                    <h2 id={`faq-${id}`}>{question}</h2>
                    <span className="faq-item__arrow" aria-hidden="true">&gt;</span>
                  </summary>
                  <div className="faq-item__answer">{answer}</div>
                </details>
              ))}
            </div>
          ))}
        </div>

        <p className="faq-page__contact-note">
          Не нашли ответ на свой вопрос?{' '}
          <a href={schoolContacts.vkUrl}>Напишите нам в сообщения группы</a>
          {' '}— с удовольствием поможем разобраться 💚
        </p>
      </main>
    </div>
  )
}
