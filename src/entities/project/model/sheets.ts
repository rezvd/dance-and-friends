import {
  buildTimeLabel,
  parseEventType,
  type ScheduleEvent,
  toIsoDate,
} from '@/entities/project/model/school-info'

const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID
const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY

type SheetsMetadataResponse = {
  sheets?: Array<{
    properties?: {
      title?: string
    }
  }>
}

type SheetsValuesResponse = {
  values?: string[][]
}

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Не задана переменная окружения ${name}`)
  }

  return value
}

function normalizeEventRow(row: string[]): ScheduleEvent | null {
  const [date = '', start = '', end = '', title = '', type = '', description = ''] = row

  if (!date || !start || !title || !type) {
    return null
  }

  return {
    date: toIsoDate(date),
    time: buildTimeLabel(start, end),
    title: title.trim(),
    description: description.trim(),
    type: parseEventType(type),
  }
}

export async function fetchScheduleEvents() {
  const safeSpreadsheetId = requireEnv(
    spreadsheetId,
    'VITE_GOOGLE_SHEETS_SPREADSHEET_ID',
  )
  const safeApiKey = requireEnv(apiKey, 'VITE_GOOGLE_SHEETS_API_KEY')

  const metadataResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${safeSpreadsheetId}?fields=sheets(properties(title))&key=${safeApiKey}`,
  )

  if (!metadataResponse.ok) {
    throw new Error('Не удалось получить структуру Google Sheets')
  }

  const metadata = (await metadataResponse.json()) as SheetsMetadataResponse
  const firstSheetTitle = metadata.sheets?.[0]?.properties?.title

  if (!firstSheetTitle) {
    throw new Error('В Google Sheets не найден ни один лист')
  }

  const range = encodeURIComponent(`${firstSheetTitle}!A:F`)
  const valuesResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${safeSpreadsheetId}/values/${range}?key=${safeApiKey}`,
  )

  if (!valuesResponse.ok) {
    throw new Error('Не удалось получить мероприятия из Google Sheets')
  }

  const payload = (await valuesResponse.json()) as SheetsValuesResponse
  const rows = payload.values ?? []

  return rows
    .slice(1)
    .map(normalizeEventRow)
    .filter((event): event is ScheduleEvent => event !== null)
    .sort((first, second) => {
      const firstKey = `${first.date} ${first.time}`
      const secondKey = `${second.date} ${second.time}`
      return firstKey.localeCompare(secondKey)
    })
}
