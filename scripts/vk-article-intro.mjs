import { parse } from 'parse5'

const allowedTags = new Set([
  'p', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'br', 'a', 'h2', 'h3', 'blockquote',
])
const ignoredTags = new Set(['script', 'style', 'svg', 'iframe', 'object', 'template'])

function attribute(node, name) {
  return node.attrs?.find((entry) => entry.name === name)?.value
}

function hasClass(node, name) {
  return (attribute(node, 'class') ?? '').split(/\s+/).includes(name)
}

function findArticle(node, articlePath) {
  if (hasClass(node, 'article_view') && attribute(node, 'data-article-url') === articlePath) {
    return node
  }
  for (const child of node.childNodes ?? []) {
    const article = findArticle(child, articlePath)
    if (article) return article
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])
}

function renderText(node, articleUrl) {
  if (node.nodeName === '#text') return escapeHtml(node.value)
  if (ignoredTags.has(node.tagName) || hasClass(node, 'article_anchor_button')) return ''

  const content = (node.childNodes ?? []).map((child) => renderText(child, articleUrl)).join('')
  if (!allowedTags.has(node.tagName)) return content
  if (node.tagName === 'br') return '<br>'
  if (node.tagName === 'a') {
    const link = attribute(node, 'href')
    if (!link) return content
    try {
      const href = new URL(link, articleUrl)
      if (!['https:', 'http:', 'mailto:', 'tel:'].includes(href.protocol)) return content
      return `<a href="${escapeHtml(href.href)}">${content}</a>`
    } catch {
      return content
    }
  }
  return `<${node.tagName}>${content}</${node.tagName}>`
}

// Only take article content before its first photo, excluding the title and author
export function extractArticleIntro(html, articleUrl) {
  const article = findArticle(parse(html), new URL(articleUrl).pathname)
  if (!article) throw new Error('Содержимое статьи не найдено')

  const firstPhotoIndex = article.childNodes.findIndex((node) => (
    node.tagName === 'figure' && attribute(node, 'data-type') === '101'
  ))
  if (firstPhotoIndex < 0) throw new Error('Первая картинка статьи не найдена')

  return article.childNodes.slice(0, firstPhotoIndex)
    .filter((node) => node.tagName !== 'h1' && !hasClass(node, 'article__info_line'))
    .map((node) => renderText(node, articleUrl))
    .join('')
    .trim()
}
