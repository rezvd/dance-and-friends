import type { CtaButton } from '@/entities/project/model/cta'

export type DanceDirection = {
  id: 'lindy' | 'blues' | 'balboa'
  title: string
  description: string
}

export type ScheduleEvent = {
  id: string
  date: string
  time: string
  title: string
  text: string
  type: EventType
  buttons: CtaButton[]
}

export type EventType = 'class' | 'event'

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

export type CalendarWeek = {
  key: string
  title: string
  events: ScheduleEvent[]
}

export const eventTypeOptions: Array<{
  value: EventType | 'all'
  label: string
}> = [
  { value: 'all', label: 'Все' },
  { value: 'class', label: 'Занятия' },
  { value: 'event', label: 'Мероприятия' },
]

export const directions: DanceDirection[] = [
  {
    id: 'lindy',
    title: 'Линди-хоп',
    description:
      'Самый распространённый из наших свинговых танцев. **Энергичный**, яркий и очень разный: можно дурачиться, много двигаться, **играть** с партнёром и музыкой',
  },
  {
    id: 'blues',
    title: 'Блюз',
    description:
      'Самый расслабленный из трёх. Здесь можно никуда не торопиться, **смаковать** музыку, уделять много внимания **контакту** внутри пары и играть с совершенно разным настроением',
  },
  {
    id: 'balboa',
    title: 'Бальбоа',
    description:
      'Самый **компактный** и отлично подходит для очень **быстрых** темпов. Здесь меньше размашистых движений и больше внимания к **точности**, взаимодействию внутри пары, ритмам и **футворку**',
  },
]

const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'UTC',
  weekday: 'short',
})
const omskDateFormatter = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'Asia/Omsk',
  year: 'numeric',
})

export function getMonthTitleFromDate(date: Date) {
  const formatted = monthFormatter.format(date)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function getWeekday(dateString: string) {
  return weekdayFormatter.format(parseIsoDate(dateString))
}

export function getDayNumber(dateString: string) {
  return parseIsoDate(dateString).getUTCDate()
}

export function parseIsoDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function getOmskToday() {
  const parts = omskDateFormatter.formatToParts(new Date())
  const year = Number(parts.find((part) => part.type === 'year')?.value)
  const month = Number(parts.find((part) => part.type === 'month')?.value)
  const day = Number(parts.find((part) => part.type === 'day')?.value)

  return new Date(Date.UTC(year, month - 1, day))
}

export function parseEventType(value: string): EventType {
  const normalized = value.trim().toLowerCase()

  if (normalized === 'занятие' || normalized === 'class') {
    return 'class'
  }

  return 'event'
}

export function buildCalendarMonths(
  events: ScheduleEvent[],
  today = getOmskToday(),
): CalendarMonth[] {
  const currentMonthStart = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
  )

  const upcomingEvents = events.filter((event) => parseIsoDate(event.date) >= currentMonthStart)
  const grouped = new Map<string, ScheduleEvent[]>()

  for (const event of upcomingEvents) {
    const date = parseIsoDate(event.date)
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
    const group = grouped.get(key)
    if (group) {
      group.push(event)
    } else {
      grouped.set(key, [event])
    }
  }

  if (grouped.size === 0) {
    const currentMonthKey = `${currentMonthStart.getUTCFullYear()}-${String(currentMonthStart.getUTCMonth() + 1).padStart(2, '0')}`
    grouped.set(currentMonthKey, [])
  }

  return Array.from(grouped.entries()).map(([key, monthEvents]) => {
    const sampleDate = parseIsoDate(`${key}-01`)
    const year = sampleDate.getUTCFullYear()
    const month = sampleDate.getUTCMonth()
    const totalDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7

    return {
      key,
      title: getMonthTitleFromDate(sampleDate),
      offset,
      days: Array.from({ length: totalDays }, (_, index) => {
        const day = index + 1
        return {
          day,
          events: monthEvents.filter(
            (event) => parseIsoDate(event.date).getUTCDate() === day,
          ),
        }
      }),
      events: monthEvents,
    }
  })
}

const shortMonthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'short',
  timeZone: 'UTC',
})

export function startOfWeek(date: Date) {
  const normalized = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  )
  const day = normalized.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  normalized.setUTCDate(normalized.getUTCDate() + diff)
  return normalized
}

export function buildCalendarWeeks(
  events: ScheduleEvent[],
  today = getOmskToday(),
): CalendarWeek[] {
  const currentWeekStart = startOfWeek(today)
  const upcomingEvents = events.filter((event) => parseIsoDate(event.date) >= currentWeekStart)
  const grouped = new Map<string, ScheduleEvent[]>()

  for (const event of upcomingEvents) {
    const weekStart = startOfWeek(parseIsoDate(event.date))
    const key = toDateKey(weekStart)
    const group = grouped.get(key)

    if (group) {
      group.push(event)
    } else {
      grouped.set(key, [event])
    }
  }

  if (grouped.size === 0) {
    grouped.set(toDateKey(currentWeekStart), [])
  }

  return Array.from(grouped.entries()).map(([key, weekEvents]) => {
    const weekStart = parseIsoDate(key)
    const weekEnd = new Date(
      Date.UTC(
        weekStart.getUTCFullYear(),
        weekStart.getUTCMonth(),
        weekStart.getUTCDate() + 6,
      ),
    )

    return {
      key,
      title: formatWeekTitle(weekStart, weekEnd),
      events: weekEvents,
    }
  })
}

function formatWeekTitle(weekStart: Date, weekEnd: Date) {
  const startMonth = shortMonthFormatter.format(weekStart).replace('.', '')
  const endMonth = shortMonthFormatter.format(weekEnd).replace('.', '')

  if (
    weekStart.getUTCFullYear() === weekEnd.getUTCFullYear() &&
    weekStart.getUTCMonth() === weekEnd.getUTCMonth()
  ) {
    return `${weekStart.getUTCDate()}–${weekEnd.getUTCDate()} ${startMonth}`
  }

  return `${weekStart.getUTCDate()} ${startMonth} — ${weekEnd.getUTCDate()} ${endMonth}`
}

function toDateKey(date: Date) {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
