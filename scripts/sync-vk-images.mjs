import { rename, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { extractArticleIntro } from './vk-article-intro.mjs'

const articles = [
  { slug: 'raspisanie', file: 'schedule.jpg', introFile: 'schedule-intro.json' },
  { slug: 'stoimost', file: 'price.jpg' },
]

// The Open Graph image is the cover, not the picture inside the article
export function extractArticleImage(html, articleUrl) {
  for (const [, attributes, content] of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi,
  )) {
    if (!/\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)) {
      continue
    }

    let article
    try {
      article = JSON.parse(content)
    } catch {
      continue
    }

    if (
      article?.['@type'] !== 'Article' ||
      article.mainEntityOfPage?.['@id'] !== articleUrl ||
      typeof article.image !== 'string'
    ) {
      continue
    }

    const imageUrl = new URL(article.image)
    if (imageUrl.protocol !== 'https:') {
      throw new Error('Ссылка на изображение должна использовать HTTPS')
    }

    return imageUrl.href
  }

  throw new Error('Изображение внутри статьи не найдено')
}

async function fetchResource(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response
}

async function saveFile(destination, content) {
  const temporary = new URL(`${destination.href}.tmp`)
  try {
    await writeFile(temporary, content)
    await rename(temporary, destination)
  } finally {
    await rm(temporary, { force: true })
  }
}

export async function syncArticleImage({ slug, file, introFile }) {
  const articleUrl = `https://vk.ru/@danceandfriendsomsk-${slug}`
  const response = await fetchResource(articleUrl.replace('://vk.ru/', '://m.vk.ru/'))
  const html = await response.text()
  if (introFile) {
    try {
      const intro = { html: extractArticleIntro(html, articleUrl) }
      await saveFile(
        new URL(`../src/entities/project/model/${introFile}`, import.meta.url),
        `${JSON.stringify(intro, null, 2)}\n`,
      )
      console.log(`[VK] Обновлено: ${introFile}`)
    } catch (error) {
      console.warn(`[VK] ${introFile}: ${error.message}. Используется сохранённый текст`)
    }
  }
  const imageUrl = extractArticleImage(html, articleUrl)
  const imageResponse = await fetchResource(imageUrl)
  const image = new Uint8Array(await imageResponse.arrayBuffer())

  // Check the JPEG signature and end marker before replacing the saved asset
  if (
    imageResponse.headers.get('content-type')?.split(';')[0].trim() !== 'image/jpeg' ||
    image[0] !== 0xff || image[1] !== 0xd8 || image[2] !== 0xff ||
    image.at(-2) !== 0xff || image.at(-1) !== 0xd9
  ) {
    throw new Error('ВК не вернул полное JPEG-изображение')
  }

  const destination = new URL(`../src/assets/images/${file}`, import.meta.url)
  await saveFile(destination, image)
}

async function syncImages() {
  await Promise.all(articles.map(async (article) => {
    try {
      await syncArticleImage(article)
      console.log(`[VK] Обновлено: ${article.file}`)
    } catch (error) {
      console.warn(
        `[VK] ${article.file}: ${error.message}. Используются сохранённые данные`,
      )
    }
  }))
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await syncImages()
}
