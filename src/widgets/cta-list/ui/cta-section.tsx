import { useEffect, useState } from 'react'

import type { CtaItem } from '@/entities/project/model/cta'
import { fetchCtaItems } from '@/entities/project/model/sheets'

import { CtaList } from './cta-list'

type CtaSectionProps = {
  className?: string
  heading?: string | null
  layout?: 'copy-above' | 'split'
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
  layout = 'split',
  variant = 'section',
}: CtaSectionProps) {
  const resolvedLayout = variant === 'hero' ? 'copy-above' : layout
  const [items, setItems] = useState<CtaItem[]>(cachedItems ?? [])
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'error'>(
    cachedItems === null ? 'loading' : 'ready',
  )

  useEffect(() => {
    let cancelled = false

    loadCtaItems()
      .then((nextItems) => {
        if (!cancelled) {
          setItems(nextItems)
          setLoadStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([])
          setLoadStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (items.length === 0) {
    if (variant === 'hero' && loadStatus === 'loading') {
      const placeholderClasses = [
        'cta-section',
        'cta-section--hero',
        `cta-section--layout-${resolvedLayout}`,
        'cta-section--hero-placeholder',
        className,
      ]
        .filter(Boolean)
        .join(' ')

      return <div className={placeholderClasses} aria-hidden="true" />
    }

    return null
  }

  const classes = [
    'cta-section',
    `cta-section--${variant}`,
    `cta-section--layout-${resolvedLayout}`,
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
