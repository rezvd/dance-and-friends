export type DanceDirection = {
  id: 'lindy' | 'blues' | 'balboa'
  title: string
  description: string
}

export type ScheduleEvent = {
  date: string
  time: string
  title: string
  description: string
  type: EventType
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

export function parseEventType(value: string): EventType {
  const normalized = value.trim().toLowerCase()

  if (normalized === 'занятие') {
    return 'class'
  }

  return 'event'
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

const shortMonthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'short',
})

export function startOfWeek(date: Date) {
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = normalized.getDay()
  const diff = day === 0 ? -6 : 1 - day
  normalized.setDate(normalized.getDate() + diff)
  return normalized
}

export function buildCalendarWeeks(events: ScheduleEvent[], today = new Date()): CalendarWeek[] {
  const currentWeekStart = startOfWeek(today)
  const upcomingEvents = events.filter((event) => parseIsoDate(event.date) >= currentWeekStart)
  const grouped = new Map<string, ScheduleEvent[]>()

  for (const event of upcomingEvents) {
    const blockStart = startOfTwoWeekBlock(parseIsoDate(event.date), currentWeekStart)
    const key = toDateKey(blockStart)
    const group = grouped.get(key)

    if (group) {
      group.push(event)
    } else {
      grouped.set(key, [event])
    }
  }

  return Array.from(grouped.entries()).map(([key, weekEvents]) => {
    const weekStart = parseIsoDate(key)
    const weekEnd = new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + 13,
    )

    return {
      key,
      title: `${weekStart.getDate()}-${weekEnd.getDate()} ${formatWeekMonthLabel(weekStart, weekEnd)}`,
      events: weekEvents,
    }
  })
}

function formatWeekMonthLabel(weekStart: Date, weekEnd: Date) {
  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return shortMonthFormatter.format(weekStart).replace('.', '')
  }

  return `${shortMonthFormatter.format(weekStart).replace('.', '')} — ${shortMonthFormatter
    .format(weekEnd)
    .replace('.', '')}`
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfTwoWeekBlock(date: Date, currentWeekStart: Date) {
  const weekStart = startOfWeek(date)
  const diffDays = Math.floor(
    (weekStart.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24),
  )
  const blockOffset = Math.floor(diffDays / 14) * 14
  return new Date(
    currentWeekStart.getFullYear(),
    currentWeekStart.getMonth(),
    currentWeekStart.getDate() + blockOffset,
  )
}
