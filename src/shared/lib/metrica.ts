import type { CtaItem } from '@/entities/project/model/cta'

const metricaCounterId = 109600188

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void
  }
}

export function trackCtaGoal(cta: CtaItem) {
  if (!cta.metrica || typeof window.ym !== 'function') {
    return
  }

  window.ym(metricaCounterId, 'reachGoal', cta.metrica, {
    cta: {
      label: cta.label,
      link: cta.link,
    },
  })
}
