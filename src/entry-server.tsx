import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'

import { App } from '@/app'

export { organization, seoPages, siteOrigin, website } from '@/shared/config/seo'

export function render(pathname: string) {
  return renderToString(
    <StrictMode>
      <App pathname={pathname} />
    </StrictMode>,
  )
}
