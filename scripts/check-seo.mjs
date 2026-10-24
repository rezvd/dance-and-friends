import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parse } from 'parse5'

const origin = 'https://dance-and-friends-omsk.ru'
const pages = [
  ['/', 'Dance and Friends Omsk — социальные танцы в Омске', 'Dance&Friends', 'Начать легко'],
  ['/directions/', 'Направления танцев — Dance&Friends Омск', 'Наши направления', 'Линди-хоп'],
  ['/teachers/', 'Преподаватели — Dance&Friends Омск', 'Наши преподаватели', 'Вадим Рябенко'],
  ['/price/', 'Стоимость занятий — Dance&Friends Омск', 'Стоимость и оплата', 'Система абонементов'],
  ['/schedule/', 'Расписание занятий — Dance&Friends Омск', 'Расписание', 'Наши преподаватели'],
  ['/contacts/', 'Контакты Dance&Friends — социальные танцы в Омске', 'Контакты', 'г. Омск, ул. Гагарина, 8/2, 4 этаж'],
]

function findAll(node, predicate) {
  return [
    ...(predicate(node) ? [node] : []),
    ...(node.childNodes ?? []).flatMap((child) => findAll(child, predicate)),
  ]
}

function attribute(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value
}

function text(node) {
  if (node.nodeName === '#text') return node.value
  return (node.childNodes ?? []).map(text).join('')
}

function exactlyOne(node, predicate, label) {
  const matches = findAll(node, predicate)
  assert.equal(matches.length, 1, `Expected one ${label}`)
  return matches[0]
}

const titles = new Set()
const descriptions = new Set()
const canonicalPaths = new Set(pages.map(([path]) => path))
const knownPaths = new Set(pages.map(([path]) => path.replace(/\/+$/, '') || '/'))

for (const [path, expectedTitle, expectedH1, expectedContent] of pages) {
  const html = await readFile(resolve('dist', `.${path}`, 'index.html'), 'utf8')
  const document = parse(html)
  const head = exactlyOne(document, (node) => node.tagName === 'head', 'head')
  const root = exactlyOne(document, (node) => attribute(node, 'id') === 'root', 'React root')
  const title = text(exactlyOne(head, (node) => node.tagName === 'title', 'title'))
  const description = attribute(exactlyOne(head, (node) =>
    node.tagName === 'meta' && attribute(node, 'name') === 'description', 'description'), 'content')
  const canonical = attribute(exactlyOne(head, (node) =>
    node.tagName === 'link' && attribute(node, 'rel') === 'canonical', 'canonical'), 'href')
  const h1 = exactlyOne(root, (node) => node.tagName === 'h1', 'H1')
  const content = text(root).replace(/\s+/g, ' ')

  assert.equal(title, expectedTitle, path)
  assert.equal(canonical, `${origin}${path}`, path)
  assert.equal(text(h1), expectedH1, path)
  assert.ok(content.includes(expectedContent), `${path}: main content is absent from HTML`)
  assert.ok(content.length > 500, `${path}: almost empty React root`)
  assert.ok(description.length >= 120 && description.length <= 160, `${path}: description length ${description.length}`)
  titles.add(title)
  descriptions.add(description)

  for (const [property, expected] of [
    ['og:title', title], ['og:description', description], ['og:type', 'website'], ['og:url', canonical],
  ]) {
    const tag = exactlyOne(head, (node) =>
      node.tagName === 'meta' && attribute(node, 'property') === property, property)
    assert.equal(attribute(tag, 'content'), expected)
  }

  const image = attribute(exactlyOne(head, (node) =>
    node.tagName === 'meta' && attribute(node, 'property') === 'og:image', 'og:image'), 'content')
  assert.ok(image.startsWith(`${origin}/`))
  await access(resolve('dist', `.${new URL(image).pathname}`))

  const robotsTags = findAll(head, (node) =>
    node.tagName === 'meta' && /^(robots|googlebot)$/i.test(attribute(node, 'name') ?? ''))
  assert.ok(robotsTags.every((node) => !/noindex|none/i.test(attribute(node, 'content') ?? '')))

  for (const node of findAll(document, (item) => Boolean(item.tagName))) {
    if (node.tagName === 'a' && attribute(node, 'href')) {
      const target = new URL(attribute(node, 'href'), origin)
      const normalizedPath = target.pathname.replace(/\/+$/, '') || '/'
      if (target.origin === origin && knownPaths.has(normalizedPath)) {
        assert.ok(canonicalPaths.has(target.pathname), `${path}: non-canonical internal link ${target.href}`)
      }
    }
    for (const name of ['src', 'href']) {
      const value = attribute(node, name)
      if (value?.startsWith('/assets/')) await access(resolve('dist', `.${value}`))
    }
  }

  const jsonLd = findAll(head, (node) =>
    node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json')
  if (path === '/') {
    assert.ok(content.includes('Dance and Friends Omsk — сообщество социальных танцев в Омске'))
    assert.equal(jsonLd.length, 1)
    const organization = JSON.parse(text(jsonLd[0]))
    assert.equal(organization['@context'], 'https://schema.org')
    assert.equal(organization['@type'], 'Organization')
    assert.equal(organization.name, 'Dance&Friends')
    assert.deepEqual(organization.alternateName, [
      'Dance and Friends Omsk',
      'Dance and Friends',
      'Dance&Friends Omsk',
      'Dance&Friends Омск',
      'Дэнс энд Френдс',
      'Дэнс энд Френдс Омск',
    ])
    assert.equal(organization.url, `${origin}/`)
    assert.equal(organization.telephone, '+7 950 797-00-50')
    assert.equal(organization.address['@type'], 'PostalAddress')
    assert.equal(organization.address.addressLocality, 'Омск')
    assert.equal(organization.address.streetAddress, 'ул. Гагарина, 8/2, 4 этаж')
    assert.deepEqual(organization.sameAs, ['https://vk.ru/danceandfriendsomsk', 'https://t.me/danceandfriendsomsk'])
    assert.ok(organization.logo.startsWith(`${origin}/`))
    await access(resolve('dist', `.${new URL(organization.logo).pathname}`))
  } else {
    assert.equal(jsonLd.length, 0)
  }

  console.log(`[SEO] ${path}: title, description (${description.length}), canonical, H1, content, OG and assets OK`)
}

assert.equal(titles.size, pages.length, 'Duplicate titles')
assert.equal(descriptions.size, pages.length, 'Duplicate descriptions')

const robots = await readFile('dist/robots.txt', 'utf8')
assert.equal(robots, `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`)
assert.equal(robots, await readFile('public/robots.txt', 'utf8'))
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
assert.equal(sitemap, await readFile('public/sitemap.xml', 'utf8'))
assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'))
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]),
  pages.map(([path]) => `${origin}${path}`))
assert.ok(!sitemap.includes('<lastmod>'), 'Do not invent page modification dates')
console.log('[SEO] Unique metadata, Organization JSON-LD, robots.txt and sitemap.xml OK')
