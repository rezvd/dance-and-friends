import { useEffect, useState } from 'react'

import type { CtaItem } from '@/entities/project/model/cta'
import { fetchCtaItems } from '@/entities/project/model/sheets'

import { CtaList } from './cta-list'

type CtaSectionProps = {
  className?: string
  heading?: string | null
  variant?: 'section' | 'embedded' | 'hero'
}

let cachedItems: CtaItem[] | null = null
let pendingRequest: Promise<CtaItem[]> | null = null

function loadCtaItems() {
  if (cachedItems) {
    return Promise.resolve(cachedItems)
  }

  if (!pendingRequest) {
    pendingRequest = fetchCtaItems()
      .then((items) => {
        cachedItems = items
        return items
      })
      .finally(() => {
        pendingRequest = null
      })
  }

  return pendingRequest
}

export function CtaSection({
  className,
  heading = 'Хотите попробовать?',
  variant = 'section',
}: CtaSectionProps) {
  const [items, setItems] = useState<CtaItem[]>(cachedItems ?? [])

  useEffect(() => {
    let cancelled = false

    loadCtaItems()
      .then((nextItems) => {
        if (!cancelled) {
          setItems(nextItems)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([])
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (items.length === 0) {
    return null
  }

  const classes = [
    'cta-section',
    `cta-section--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={classes} aria-label={heading ?? 'Запись на занятия'}>
      <CtaList heading={heading} items={items} />
    </section>
  )
}
