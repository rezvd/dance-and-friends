import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import { organization, render, seoPages, siteOrigin, website } from '../dist-ssr/entry-server.js'

const outputDirectory = resolve('dist')
const template = await readFile(resolve(outputDirectory, 'index.html'), 'utf8')
const headMarker = /<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/
const appMarker = '<div id="root"></div>'
const image = template.match(/<meta property="og:image" content="([^"]+)"\s*\/?>/)?.[1]

if (!headMarker.test(template) || !template.includes(appMarker) || !image) {
  throw new Error('Missing prerender placeholders or Open Graph image in built HTML')
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])
}

for (const page of seoPages) {
  const canonical = `${siteOrigin}${page.path}`
  const tags = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${new URL(image, siteOrigin).href}" />`,
    ...(page.path === '/' ? [organization, website].map((entity) =>
      `<script type="application/ld+json">${JSON.stringify(entity).replaceAll('<', '\\u003c')}</script>`,
    ) : []),
  ]
  const html = template
    .replace(headMarker, () => tags.join('\n    '))
    .replace(appMarker, () => `<div id="root">${render(page.path)}</div>`)
  const destination = resolve(outputDirectory, `.${page.path}`, 'index.html')
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, html)
  console.log(`[prerender] ${page.path} → ${destination}`)
}
