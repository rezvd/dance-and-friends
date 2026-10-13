import assert from 'node:assert/strict'
import test from 'node:test'
import { extractArticleIntro } from './vk-article-intro.mjs'

const articleUrl = 'https://vk.ru/@danceandfriendsomsk-raspisanie'
const wrap = (intro) => `
  <p>Outside the article</p>
  <div class="article article_view article_mobile" data-article-url="/@danceandfriendsomsk-raspisanie">
    <h1>Article title</h1>
    <div class="article__info_line"><a href="/group">Author</a> · Date</div>
    ${intro}
    <figure data-type="101"><img src="schedule.jpg"></figure>
    <p>Teachers after the photo</p>
  </div>
`

test('extracts only the intro, preserving lists, emphasis, line breaks and entities', () => {
  const intro = '<p>Расписание &amp; набор</p><ul class="list"><li>До <strong class="bold">16 ноября</strong><br>С нуля</li><li><em>Набор открыт</em></li></ul>'
  assert.equal(
    extractArticleIntro(wrap(intro), articleUrl),
    '<p>Расписание &amp; набор</p><ul><li>До <strong>16 ноября</strong><br>С нуля</li><li><em>Набор открыт</em></li></ul>',
  )
})

test('discards executable markup and attributes while preserving safe links and text', () => {
  const intro = `<p onclick="alert(1)">Текст &lt;img src=x onerror=alert(1)&gt;
    <script>alert(1)</script><iframe>Unwanted</iframe><svg><text>Unwanted</text></svg>
    <a href="javascript&#58;alert(1)">Bad link</a><a>No URL</a>
    <a href="/danceandfriendsomsk" onclick="alert(1)">ВК</a>
    <a href="https://example.com/?a=1&amp;b=2">Safe</a></p>`
  const result = extractArticleIntro(wrap(intro), articleUrl)
  assert.ok(!/<script|<iframe|<svg|onclick|href="javascript/.test(result))
  assert.ok(!result.includes('Unwanted'))
  assert.ok(result.includes('&lt;img src=x onerror=alert(1)&gt;'))
  assert.ok(result.includes('Bad link'))
  assert.ok(!result.includes('/undefined'))
  assert.ok(result.includes('<a href="https://vk.ru/danceandfriendsomsk">ВК</a>'))
  assert.ok(result.includes('<a href="https://example.com/?a=1&amp;b=2">Safe</a>'))
})

test('rejects an unrelated page or a missing first photo so the sync retains saved text', () => {
  assert.throws(() => extractArticleIntro('<p>Login required</p>', articleUrl), /Содержимое статьи/)
  assert.throws(() => extractArticleIntro(wrap('Text'), 'https://vk.ru/@another-article'), /Содержимое статьи/)
  assert.throws(() => extractArticleIntro(wrap('Text').replace('data-type="101"', 'data-type="video"'), articleUrl), /Первая картинка/)
})

test('accepts an empty intro when the author removes the text before the photo', () => {
  assert.equal(extractArticleIntro(wrap(''), articleUrl), '')
})
