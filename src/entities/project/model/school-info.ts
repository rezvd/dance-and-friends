export type DanceDirection = {
  title: string
  description: string
}

export type ScheduleEvent = {
  date: string
  time: string
  title: string
  description: string
}

export type CalendarDay = {
  day: number
  events: ScheduleEvent[]
}

export type CalendarMonth = {
  key: string
  title: string
  offset: number
  days: CalendarDay[]
  events: ScheduleEvent[]
}

export const directions: DanceDirection[] = [
  {
    title: 'Линди хоп',
    description:
      'Парный свинговый танец с **живой пружинящей базой**, музыкальностью и пространством для импровизации. На занятиях разбираем **ведение и следование**, базовые ритмы и уверенное социальное взаимодействие.',
  },
  {
    title: 'Блюз',
    description:
      'Блюз помогает услышать музыку телом: **вес паузы дыхание и контакт**. Работаем с пластикой, грувом, музыкальностью и **бережным диалогом в паре**.',
  },
  {
    title: 'Бальбоа',
    description:
      'Компактный и элегантный танец для **быстрой свинговой музыки**. Подходит тем, кто любит **точность и скорость**, чистую работу ног и ощущение потока.',
  },
  {
    title: 'Соло джаз',
    description:
      'Развиваем **координацию ритм и свободу движения**. Учим шаги эпохи свинга, собираем их в связки и постепенно выходим к **уверенной импровизации**.',
  },
  {
    title: 'Практики и встречи',
    description:
      'Помимо занятий собираемся на **самостоятельные практики вечеринки и опен-эйры** и специальные события. Это пространство, где можно **танцевать больше** и находить своих людей.',
  },
]

const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  year: 'numeric',
})

const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })

export function getMonthTitleFromDate(date: Date) {
  const formatted = monthFormatter.format(date)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function getWeekday(dateString: string) {
  return weekdayFormatter.format(parseIsoDate(dateString))
}

export function getDayNumber(dateString: string) {
  return parseIsoDate(dateString).getDate()
}

export function parseSheetDate(value: string) {
  const [day, month, year] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function parseIsoDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toIsoDate(value: string) {
  const date = parseSheetDate(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function buildTimeLabel(start: string, end?: string) {
  return end ? `${start}-${end}` : start
}

export function buildCalendarMonths(events: ScheduleEvent[], today = new Date()): CalendarMonth[] {
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const upcomingEvents = events.filter((event) => parseIsoDate(event.date) >= currentMonthStart)
  const grouped = new Map<string, ScheduleEvent[]>()

  for (const event of upcomingEvents) {
    const date = parseIsoDate(event.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const group = grouped.get(key)
    if (group) {
      group.push(event)
    } else {
      grouped.set(key, [event])
    }
  }

  return Array.from(grouped.entries()).map(([key, monthEvents]) => {
    const sampleDate = parseIsoDate(monthEvents[0].date)
    const year = sampleDate.getFullYear()
    const month = sampleDate.getMonth()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const offset = (new Date(year, month, 1).getDay() + 6) % 7

    return {
      key,
      title: getMonthTitleFromDate(sampleDate),
      offset,
      days: Array.from({ length: totalDays }, (_, index) => {
        const day = index + 1
        return {
          day,
          events: monthEvents.filter((event) => parseIsoDate(event.date).getDate() === day),
        }
      }),
      events: monthEvents,
    }
  })
}
