import {
  normalizeCtaColor,
  normalizeCtaLink,
  normalizeMetricaGoal,
  type CtaItem,
} from '@/entities/project/model/cta'

const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID
const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY

type SheetsValuesResponse = {
  values?: string[][]
}

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Не задана переменная окружения ${name}`)
  }

  return value
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
