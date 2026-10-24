import scheduleIntro from '@/entities/project/model/schedule-intro.json'
import { CtaSection } from '@/widgets/cta-list'
import { EventCalendar } from '@/widgets/event-calendar'

import './schedule-page.css'

export function SchedulePage() {
  return (
    <div className="schedule-page">
      <header className="schedule-page__hero">
        <div className="schedule-page__hero-inner">
          <h1>Расписание</h1>
        </div>
      </header>

      <main className="schedule-page__content">
        {scheduleIntro.html && (
          <aside
            className="schedule-page__start"
            dangerouslySetInnerHTML={{ __html: scheduleIntro.html }}
          />
        )}

        <EventCalendar />

        <CtaSection className="schedule-page__cta" />
      </main>
    </div>
  )
}
