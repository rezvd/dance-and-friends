export type DanceDirection = {
  title: string
  description: string
}

export type ScheduleEvent = {
  date: string
  time: string
  title: string
  description: string
  href?: string
}

export type CalendarDay = {
  day: number
  events: ScheduleEvent[]
}

export type CalendarMonth = {
  title: string
  offset: number
  days: CalendarDay[]
}

export const directions: DanceDirection[] = [
  {
    title: 'Линди хоп',
    description:
      'Парный свинговый танец с живой, пружинящей базой, музыкальностью и большим пространством для импровизации. На занятиях разбираем ведение и следование, базовые ритмы, повороты, свинг-ауты и умение танцевать под разную скорость джаза.',
  },
  {
    title: 'Блюз парный и соло',
    description:
      'Блюз учит слышать медленную музыку телом: вес, паузы, дыхание, контакт и точную работу с ритмом. В парном блюзе важны бережное взаимодействие и диалог, а в соло — пластика, грув, изоляции и личная выразительность.',
  },
  {
    title: 'Бальбоа',
    description:
      'Компактный и элегантный парный танец для быстрой свинговой музыки. Он строится на близкой рамке, аккуратной работе ног, поворотах и ощущении потока, поэтому отлично подходит тем, кто любит техничность и скорость без лишней суеты.',
  },
  {
    title: 'Соло джаз',
    description:
      'Соло джаз развивает координацию, ритм, свободу движения и танцевальный словарь эпохи свинга. Учим шаги, связки, вариации, работу с акцентами и постепенно собираем всё это в уверенную импровизацию.',
  },
  {
    title: 'Самоподготовка',
    description:
      'Сампо — время для самостоятельной практики, повторения материала, обмена идеями и танцев с разными партнёрами. Иногда встречи проходят с модерацией: задаём тему, разбираем вопросы и помогаем друг другу расти.',
  },
]

const selfPracticeDates = [
  '2026-05-15',
  '2026-05-19',
  '2026-05-22',
  '2026-05-26',
  '2026-05-29',
  '2026-06-02',
  '2026-06-05',
  '2026-06-09',
  '2026-06-12',
  '2026-06-16',
  '2026-06-19',
  '2026-06-23',
  '2026-06-26',
  '2026-06-30',
  '2026-07-03',
  '2026-07-07',
  '2026-07-10',
  '2026-07-14',
  '2026-07-17',
  '2026-07-21',
  '2026-07-24',
  '2026-07-28',
  '2026-07-31',
]

const selfPracticeEvents: ScheduleEvent[] = selfPracticeDates.map((date) => ({
  date,
  time: '19:00',
  title: 'Сампо',
  description: 'Самостоятельная практика для всех, кто хочет танцевать больше.',
}))

export const scheduleEvents: ScheduleEvent[] = [
  ...selfPracticeEvents,
  {
    date: '2026-05-16',
    time: '17:00–19:00',
    title: 'Опен-эйр на Зеленом острове',
    description: 'Танцуем на свежем воздухе и зовём друзей.',
    href: 'https://2gis.ru/omsk/geo/70030077061620277',
  },
  {
    date: '2026-05-23',
    time: '19:00',
    title: 'Модерируемое сампо',
    description: 'Тема будет объявлена в группе.',
  },
  {
    date: '2026-05-30',
    time: '09:00–21:00',
    title: 'Выезд на остров',
    description: 'Большой день вместе: танцы, общение и летнее настроение.',
  },
  {
    date: '2026-06-13',
    time: '19:00',
    title: 'Вечеринка или опен-эйр',
    description: 'Формат выберем по погоде.',
  },
  {
    date: '2026-06-20',
    time: '19:00',
    title: 'Модерируемое сампо',
    description: 'Тема будет объявлена в группе.',
  },
  {
    date: '2026-06-27',
    time: '19:00',
    title: 'Вечеринка или опен-эйр',
    description: 'Формат выберем по погоде.',
  },
  {
    date: '2026-07-04',
    time: '19:00',
    title: 'Модерируемое сампо',
    description: 'Тема будет объявлена в группе.',
  },
  {
    date: '2026-07-11',
    time: '19:00',
    title: 'Вечеринка или опен-эйр',
    description: 'Формат выберем по погоде.',
  },
  {
    date: '2026-07-18',
    time: '19:00',
    title: 'Модерируемое сампо',
    description: 'Тема будет объявлена в группе.',
  },
  {
    date: '2026-07-25',
    time: '19:00',
    title: 'Вечеринка или опен-эйр',
    description: 'Формат выберем по погоде.',
  },
].sort((first, second) => first.date.localeCompare(second.date))

const getEventsByDay = (month: number, day: number) =>
  scheduleEvents.filter((event) => {
    const [, eventMonth, eventDay] = event.date.split('-').map(Number)
    return eventMonth === month && eventDay === day
  })

const makeDays = (month: number, totalDays: number): CalendarDay[] =>
  Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1
    return {
      day,
      events: getEventsByDay(month, day),
    }
  })

export const calendarMonths: CalendarMonth[] = [
  {
    title: 'Май 2026',
    offset: 4,
    days: makeDays(5, 31),
  },
  {
    title: 'Июнь 2026',
    offset: 0,
    days: makeDays(6, 30),
  },
  {
    title: 'Июль 2026',
    offset: 2,
    days: makeDays(7, 31),
  },
]
