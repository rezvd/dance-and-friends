import {
  normalizeCtaColor,
  normalizeCtaLink,
  normalizeMetricaGoal,
  type CtaButton,
} from '@/entities/project/model/cta'
import {
  type EventType,
  type ScheduleEvent,
} from '@/entities/project/model/school-info'

const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID
const apiKey =
  import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY?.trim() ||
  import.meta.env.VITE_GOOGLE_SHEETS_API_KEY?.trim()
const omskTimeZone = 'Asia/Omsk'

type CalendarDateTime = {
  date?: string
  dateTime?: string
}

type CalendarApiEvent = {
  description?: string
  end?: CalendarDateTime
  id?: string
  start?: CalendarDateTime
  status?: string
  summary?: string
}

type CalendarEventsResponse = {
  items?: CalendarApiEvent[]
  nextPageToken?: string
}

type CalendarEventDescription = {
  buttons?: unknown
  text?: unknown
  type?: unknown
}

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: omskTimeZone,
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  timeZone: omskTimeZone,
})

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Не задана переменная окружения ${name}`)
  }

  return value
}

function formatDateInOmsk(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const parts = dateFormatter.formatToParts(date)
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  return year && month && day ? `${year}-${month}-${day}` : ''
}

function formatTimeInOmsk(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : timeFormatter.format(date)
}

function getCalendarWindow() {
  const [year, month] = formatDateInOmsk(new Date().toISOString())
    .split('-')
    .map(Number)
  const endMonthIndex = month - 1 + 12
  const endYear = year + Math.floor(endMonthIndex / 12)
  const endMonth = String((endMonthIndex % 12) + 1).padStart(2, '0')

  return {
    timeMax: `${endYear}-${endMonth}-01T00:00:00+06:00`,
    timeMin: `${year}-${String(month).padStart(2, '0')}-01T00:00:00+06:00`,
  }
}

function normalizeInlineWhitespace(value: string) {
  return value
    .replace(/<br\b[^>]*>/gi, ' ')
    .replace(/[\s\u00a0\u202f]+/g, ' ')
    .trim()
}

function normalizeCalendarButton(value: unknown): CtaButton | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const button = value as Record<string, unknown>
  const label =
    typeof button.label === 'string'
      ? normalizeInlineWhitespace(button.label)
      : ''
  const rawLink = typeof button.link === 'string' ? button.link.trim() : ''
  const link = normalizeCtaLink(rawLink)

  if (!label || !link) {
    return null
  }

  return {
    label,
    link,
    color: normalizeCtaColor(
      typeof button.color === 'string' ? button.color : undefined,
    ),
    metrica: normalizeMetricaGoal(
      typeof button.metrica === 'string' ? button.metrica : undefined,
    ),
  }
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value) as unknown
  } catch {
    return undefined
  }
}

function extractCalendarDescriptionText(value: string) {
  const document = new DOMParser().parseFromString(
    value.replace(/<br\b[^>]*>/gi, ' '),
    'text/html',
  )

  return (document.body.textContent ?? '')
    .replace(/[\u00a0\u202f]/g, ' ')
    .trim()
}

function normalizeCalendarText(value: string) {
  return value
    .replace(/<br\b[^>]*>/gi, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u00a0\u202f]/g, ' ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim()
}

function parseCalendarDescription(value: string | undefined) {
  if (!value?.trim()) {
    return null
  }

  const descriptionText = extractCalendarDescriptionText(value)
  const parsed =
    tryParseJson(value) ?? tryParseJson(descriptionText)

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null
  }

  const payload = parsed as CalendarEventDescription

  const rawType =
    typeof payload.type === 'string' ? payload.type.trim().toLowerCase() : ''

  if (rawType !== 'class' && rawType !== 'event') {
    return null
  }

  const type: EventType = rawType
  const text =
    typeof payload.text === 'string' ? normalizeCalendarText(payload.text) : ''
  const buttons = Array.isArray(payload.buttons)
    ? payload.buttons
        .map(normalizeCalendarButton)
        .filter((button): button is CtaButton => button !== null)
    : []

  return { buttons, text, type }
}

function normalizeCalendarEvent(event: CalendarApiEvent): ScheduleEvent | null {
  const id = event.id?.trim() ?? ''
  const title = event.summary?.trim() ?? ''
  const start = event.start

  if (!id || !title || !start || event.status === 'cancelled') {
    return null
  }

  const isAllDay = Boolean(start.date && !start.dateTime)
  const date = start.date ?? formatDateInOmsk(start.dateTime ?? '')
  const startTime = start.dateTime ? formatTimeInOmsk(start.dateTime) : ''
  const endTime = event.end?.dateTime
    ? formatTimeInOmsk(event.end.dateTime)
    : ''

  if (!date || (!isAllDay && !startTime)) {
    return null
  }

  const details = parseCalendarDescription(event.description)

  if (!details) {
    return null
  }

  return {
    id,
    date,
    time: isAllDay
      ? 'Весь день'
      : endTime
        ? `${startTime}–${endTime}`
        : startTime,
    title,
    text: details.text,
    type: details.type,
    buttons: details.buttons,
  }
}

export async function fetchCalendarEvents() {
  const safeCalendarId = requireEnv(
    calendarId,
    'VITE_GOOGLE_CALENDAR_ID',
  )
  const safeApiKey = requireEnv(
    apiKey,
    'VITE_GOOGLE_CALENDAR_API_KEY или VITE_GOOGLE_SHEETS_API_KEY',
  )
  const events: CalendarApiEvent[] = []
  const { timeMax, timeMin } = getCalendarWindow()
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({
      eventTypes: 'default',
      fields:
        'nextPageToken,items(id,status,summary,description,start,end)',
      key: safeApiKey,
      maxResults: '2500',
      orderBy: 'startTime',
      showDeleted: 'false',
      singleEvents: 'true',
      timeMax,
      timeMin,
      timeZone: omskTimeZone,
    })

    if (pageToken) {
      params.set('pageToken', pageToken)
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(safeCalendarId)}/events?${params}`,
    )

    if (!response.ok) {
      throw new Error('Не удалось получить мероприятия из Google Calendar')
    }

    const payload = (await response.json()) as CalendarEventsResponse
    events.push(...(payload.items ?? []))
    pageToken = payload.nextPageToken
  } while (pageToken)

  return events
    .map(normalizeCalendarEvent)
    .filter((event): event is ScheduleEvent => event !== null)
}
