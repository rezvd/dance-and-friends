# Развёртывание SEO-обновления

Сайт размещён в Timeweb Cloud App Platform. Веб-сервером управляет платформа:
подключать Caddyfile из репозитория и выполнять команды на сервере не требуется.
Заголовок `Server: Caddy` указывает на используемое ПО, но не даёт доступа к его
конфигурации. Предыдущая инструкция с `/etc/caddy/Caddyfile` относилась к
самостоятельному серверу и для этого размещения не подходит.

## Что входит в сборку

`npm run build` выполняет обычную сборку Vite, собирает временный модуль для
рендеринга React и сохраняет HTML шести маршрутов:

| URL | Файл |
| --- | --- |
| `/` | `dist/index.html` |
| `/directions/` | `dist/directions/index.html` |
| `/teachers/` | `dist/teachers/index.html` |
| `/price/` | `dist/price/index.html` |
| `/schedule/` | `dist/schedule/index.html` |
| `/contacts/` | `dist/contacts/index.html` |

Канонические адреса внутренних страниц заканчиваются на `/`. Это соответствует
выдаче каталогов в Timeweb App Platform: `/teachers` перенаправляется на
`/teachers/`, а конечный адрес возвращает `200`. Canonical, Open Graph, sitemap
и внутренние ссылки используют адреса со слешем, чтобы при переходах по сайту
не возникало лишних редиректов.

В каждом HTML уже есть H1, текст страницы, уникальные title и description,
canonical и Open Graph. Главная содержит отдельные блоки Organization и WebSite
в JSON-LD с общими name, alternateName и url. WebSite задаёт предпочтительное
название сайта `Dance&Friends` и альтернативные названия. Для logo в Organization
используется существующая публичная иконка сайта `android-chrome-512x512.png`,
для og:image — существующее изображение `cover.png` с именем из сборки Vite.
Оба URL абсолютные и ведут на основной домен.

После загрузки JavaScript React подключает обработчики к готовому HTML.
Календарь Google и CTA из таблицы продолжают загружаться в браузере.
Для работы опубликованного сайта Node.js не нужен. Каталог `dist-ssr/`
используется только во время сборки, публиковать его не требуется.

Метаданные редактируются в `src/shared/config/seo.ts`. При изменении состава
страниц нужно также обновить `public/sitemap.xml` и проверки в
`scripts/check-seo.mjs`. Даты lastmod намеренно не указаны: достоверного источника
дат изменения страниц в проекте нет.

## Деплой в Timeweb App Platform

1. В настройках деплоя приложения укажите:

   - команду сборки: `npm run build`;
   - директорию сборки: `dist`;
   - Node.js не ниже 22.12;
   - существующие переменные `VITE_GOOGLE_*`.

   Директория `dist` должна публиковаться целиком, включая вложенные страницы,
   `assets/`, иконки, robots.txt и sitemap.xml. Подробнее:
   [параметры сборки App Platform](https://timeweb.cloud/docs/apps/deploying-frontend-apps).

   Для локальной проверки:

   ```bash
   npm ci
   npm run build
   ```

   Команда автоматически запускает `npm run check:seo`. Ошибки в готовых
   метаданных, основном тексте или ссылках на ассеты останавливают сборку.
   Предварительная синхронизация с VK сохраняет прежнее поведение: при
   недоступности VK используются сохранённые изображения и текст расписания.

2. Откройте приложение → «Настройки» → «Домены» → «Редактировать».
   Привяжите к этому приложению оба имени:
   `dance-and-friends-omsk.ru` и `www.dance-and-friends-omsk.ru`.
   Настройте DNS по подсказкам панели и дождитесь выпуска SSL для обоих имён.
   App Platform выпускает и продлевает сертификаты автоматически после привязки
   доменов. Одной DNS-записи для www без привязки к приложению недостаточно.
   [Привязка доменов](https://timeweb.cloud/docs/apps/upravlenie-apps-v-paneli#привязка-домена).

3. В «Настройки» → «Настройки веб-сервера» → «Настроить» добавьте редирект:

   | Поле | Значение |
   | --- | --- |
   | Type | `host` |
   | Source | `www.dance-and-friends-omsk.ru` |
   | Destination | `dance-and-friends-omsk.ru` |
   | Code | `308` |

   Оба домена должны быть привязаны к приложению, чтобы их можно было выбрать.
   Сохранение параметров запускает деплой.
   [Настройки веб-сервера](https://timeweb.cloud/docs/apps/reverse-proxy).

4. Проверьте SPA Fallback в тех же настройках. Он предназначен для
   несуществующих путей. robots.txt, sitemap.xml и готовый HTML каждой страницы
   должны отдаваться как реальные файлы. После публикации обязательно сравните
   исходный HTML внутренних URL с соответствующими файлами `dist/`: проверка
   самих файлов сборки не подтверждает настройки управляемого веб-сервера.

5. Опубликуйте коммит с SEO-изменениями через обычный деплой App Platform.
   `vercel.json` применяется только к старому сайту на Vercel. Сбросьте старый
   HTML-кеш, если он настроен перед приложением.

Настройки аккаунта Timeweb из этого проекта не изменяются. Сертификат www,
редиректы и выдачу HTML по внутренним адресам нужно подтвердить на опубликованном
приложении. Если внутренний URL возвращает HTML главной или статика подменяется
SPA fallback, потребуется настройка платформы или обращение в поддержку Timeweb;
клиентский JavaScript эту серверную проблему не исправляет.

## Проверка после публикации

Проверьте статусы и Content-Type:

```bash
curl -I https://dance-and-friends-omsk.ru/robots.txt
curl -I https://dance-and-friends-omsk.ru/sitemap.xml
curl -I https://dance-and-friends-omsk.ru/teachers/
```

Ожидается `200` и соответственно `text/plain`, `application/xml`, `text/html`.
robots.txt должен содержать разрешение обхода и ссылку на sitemap, а sitemap —
XML с шестью каноническими URL. В ответах не должно быть `X-Robots-Tag: noindex`.
В конфигурации проекта такой заголовок и метатеги noindex не задаются.

Проверьте нормализацию старого адреса без слеша:

```bash
curl -I 'https://dance-and-friends-omsk.ru/teachers?utm_source=check'
curl -I 'https://dance-and-friends-omsk.ru/teachers/?utm_source=check'
```

Первый запрос должен вернуть постоянный редирект на
`/teachers/?utm_source=check`, второй — `200` без заголовка Location.
В HTML canonical должен указывать `https://dance-and-friends-omsk.ru/teachers/`
без параметров запроса. Каждый адрес sitemap должен сразу возвращать `200`.

Проверьте редиректы **без** отключения проверки сертификата:

```bash
curl -I 'https://www.dance-and-friends-omsk.ru/teachers/?utm_source=check'
curl -I 'http://www.dance-and-friends-omsk.ru/teachers/?utm_source=check'
curl -I 'http://dance-and-friends-omsk.ru/teachers/?utm_source=check'
curl -sSL -o /dev/null -w '%{http_code} redirects=%{num_redirects} final=%{url_effective}\n' 'https://www.dance-and-friends-omsk.ru/teachers/?utm_source=check'
```

Каждый исходный URL должен вернуть постоянный редирект (`301` или `308`) на
`https://dance-and-friends-omsk.ru/teachers/?utm_source=check`.
Для редиректа www в панели выбран `308`. Последняя команда должна показать
`200`, `redirects=1` и канонический адрес с сохранёнными путём и query string.
HTTP → HTTPS также проверяется публичным запросом: локальный Caddyfile не может
настроить это перенаправление в App Platform.

Откройте исходный HTML всех шести страниц или загрузите его через curl.
Проверьте title, description, canonical, H1, текст страницы и абсолютные OG URL.
На главной проверьте Organization и WebSite через
[Schema.org Validator](https://validator.schema.org/), вставив HTML из `dist/index.html`
или указав опубликованный адрес. Проверьте также страницы с отключённым JavaScript,
мобильное меню, галереи видео и загрузку CTA и мероприятий.

## Google Search Console

После публикации:

1. Добавьте доменный ресурс `dance-and-friends-omsk.ru` в
   [Google Search Console](https://search.google.com/search-console/).
   Подтвердите владение через DNS TXT, который выдаст Google.
2. В разделе Sitemaps отправьте
   `https://dance-and-friends-omsk.ru/sitemap.xml` и проверьте успешную обработку.
3. Откройте URL Inspection для `https://dance-and-friends-omsk.ru/`, выполните
   проверку опубликованной страницы и убедитесь, что она доступна Googlebot.
4. Проверьте выбранный canonical и нажмите Request Indexing. При необходимости
   повторите проверку для внутренних страниц.
5. Отслеживайте отчёт об индексировании страниц и причины исключения URL.

Проверка владения описана в
[справке Search Console](https://support.google.com/webmasters/answer/9008080).
Отправка sitemap и запрос индексирования помогают обнаружить страницы, но
не гарантируют срок появления сайта в выдаче или позицию по запросу
«dance and friends omsk» — см.
[пояснение Google](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
