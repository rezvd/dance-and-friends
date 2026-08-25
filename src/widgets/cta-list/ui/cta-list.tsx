import type { CSSProperties } from 'react'

import type { CtaItem } from '@/entities/project/model/cta'
import { trackCtaGoal } from '@/shared/lib/metrica'

import './cta-list.css'

type CtaListProps = {
  heading?: string | null
  items: CtaItem[]
}

type CtaStyle = CSSProperties & {
  '--cta-color': string
}

type CtaButtonsStyle = CSSProperties & {
  '--cta-button-count': number
}

const defaultColors = ['var(--accent-strong)', '#f2a045']

export function CtaList({ heading, items }: CtaListProps) {
  const textItems = items.filter((item) => item.text)
  const hasIntro = Boolean(heading || textItems.length)
  const buttonsStyle: CtaButtonsStyle = {
    '--cta-button-count': items.length,
  }

  return (
    <div
      className={hasIntro ? 'cta-list' : 'cta-list cta-list--buttons-only'}
      aria-label="Запись на занятия"
    >
      {hasIntro ? (
        <div className="cta-list__copy">
          {heading ? <h2 className="cta-section__title">{heading}</h2> : null}
          {textItems.map((item) => (
            <p key={`${item.label}-${item.text}`}>{item.text}</p>
          ))}
        </div>
      ) : null}

      <div className="cta-list__buttons" style={buttonsStyle}>
        {items.map((item, index) => {
          const isExternalLink = /^https?:\/\//i.test(item.link)
          const isLastButton = index === items.length - 1
          const style: CtaStyle | undefined = isLastButton
            ? undefined
            : {
                '--cta-color':
                  item.color || defaultColors[index % defaultColors.length],
              }

          return (
            <a
              className={
                isLastButton
                  ? 'cta-button cta-button--outline'
                  : 'cta-button cta-button--filled'
              }
              href={item.link}
              key={`${item.label}-${item.link}`}
              onClick={() => trackCtaGoal(item)}
              rel={isExternalLink ? 'noreferrer' : undefined}
              style={style}
              target={isExternalLink ? '_blank' : undefined}
            >
              {item.label}
            </a>
          )
        })}
      </div>
    </div>
  )
}
