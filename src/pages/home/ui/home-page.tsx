import { fsdLayers, projectStack } from '@/entities/project/model/project-info'
import { Button } from '@/shared/ui/button'

import './home-page.css'

export function HomePage() {
  return (
    <section className="home-page">
      <div className="home-page__hero">
        <p className="home-page__eyebrow">Modern React starter</p>
        <h1>Vite + React + TypeScript with FSD from day one.</h1>
        <p className="home-page__lead">
          Clean aliases, layered structure, shared UI primitives, and a small
          application shell are ready for real product code.
        </p>
        <div className="home-page__actions">
          <Button type="button">Start building</Button>
          <Button type="button" variant="secondary">
            Check structure
          </Button>
        </div>
      </div>

      <div className="home-page__grid" id="stack">
        <article className="home-page__panel">
          <h2>Stack</h2>
          <ul>
            {projectStack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="home-page__panel" id="structure">
          <h2>FSD layers</h2>
          <ul>
            {fsdLayers.map((layer) => (
              <li key={layer}>
                <code>src/{layer}</code>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
