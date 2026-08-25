import {
  buildTimeLabel,
  parseEventType,
  type ScheduleEvent,
  toIsoDate,
} from '@/entities/project/model/school-info'
import type { CtaItem } from '@/entities/project/model/cta'

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

function normalizeCtaLink(value: string) {
  if (value.startsWith('/')) {
    return value
  }

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? value : ''
  } catch {
    return ''
  }
}

function normalizeCtaColor(value: string | undefined) {
  const color = value?.trim() ?? ''
  const isHexColor = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(
    color,
  )
  return isHexColor ? color : undefined
}

function normalizeMetricaGoal(value: string | undefined) {
  const goal = value?.trim() ?? ''
  return /^[a-z\d_-]+$/i.test(goal) ? goal : undefined
}

function normalizeCtaText(value: string | undefined) {
  return (value?.trim() ?? '').replace(/[.…]+$/u, '')
}

function normalizeCtaRows(rows: string[][]): CtaItem[] {
  const [headerRow = [], ...dataRows] = rows
  const headers = headerRow.map((header) => header.trim().toLowerCase())
  const getColumnIndex = (name: string) => headers.indexOf(name)
  const labelIndex = getColumnIndex('label')
  const linkIndex = getColumnIndex('link')
  const textIndex = getColumnIndex('text')
  const colorIndex = getColumnIndex('color')
  const metricaIndex = getColumnIndex('metrica')

  if (labelIndex < 0 || linkIndex < 0) {
    throw new Error('В листе cta нужны колонки label и link')
  }

  return dataRows.flatMap((row) => {
    const label = normalizeCtaText(row[labelIndex])
    const link = normalizeCtaLink(row[linkIndex]?.trim() ?? '')

    if (!label || !link) {
      return []
    }

    const text = normalizeCtaText(textIndex >= 0 ? row[textIndex] : undefined)
    const color = normalizeCtaColor(
      colorIndex >= 0 ? row[colorIndex] : undefined,
    )
    const metrica = normalizeMetricaGoal(
      metricaIndex >= 0 ? row[metricaIndex] : undefined,
    )

    return [
      {
        label,
        link,
        text,
        color,
        metrica,
      },
    ]
  })
}

async function fetchSheetValues(sheetTitle: string, columns: string) {
  const safeSpreadsheetId = requireEnv(
    spreadsheetId,
    'VITE_GOOGLE_SHEETS_SPREADSHEET_ID',
  )
  const safeApiKey = requireEnv(apiKey, 'VITE_GOOGLE_SHEETS_API_KEY')
  const range = encodeURIComponent(`'${sheetTitle}'!${columns}`)
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${safeSpreadsheetId}/values/${range}?key=${safeApiKey}`,
  )

  if (!response.ok) {
    throw new Error(`Не удалось получить данные листа ${sheetTitle}`)
  }

  const payload = (await response.json()) as SheetsValuesResponse
  return payload.values ?? []
}

export async function fetchCtaItems() {
  const rows = await fetchSheetValues('cta', 'A:E')
  return normalizeCtaRows(rows)
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
