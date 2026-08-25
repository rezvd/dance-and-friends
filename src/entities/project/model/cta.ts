export type CtaButton = {
  label: string
  link: string
  color?: string
  metrica?: string
}

export type CtaItem = CtaButton & {
  text: string
}

export function normalizeCtaLink(value: string) {
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

export function normalizeCtaColor(value: string | undefined) {
  const color = value?.trim() ?? ''
  const isHexColor = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(
    color,
  )
  return isHexColor ? color : undefined
}

export function normalizeMetricaGoal(value: string | undefined) {
  const goal = value?.trim() ?? ''
  return /^[a-z\d_-]+$/i.test(goal) ? goal : undefined
}
