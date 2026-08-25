# Dance&Friends

Modern React starter on Vite, TypeScript, ESLint, and Feature-Sliced Design.

## Stack

- Vite 8
- React 19
- TypeScript 6
- ESLint 10
- Feature-Sliced Design

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Environment

```bash
VITE_GOOGLE_CALENDAR_ID=calendar-id@group.calendar.google.com
VITE_GOOGLE_CALENDAR_API_KEY=
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1uQNCTFndlecN_nbwzXtEtXf6cqjvc4u_e6ACBi-w5iQ
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyAmT5GvCf-d7MTNl3S0d_zw2tx0QKY2Lbw
VITE_VK_GROUP_URL=https://vk.com/club238903782
```

Use Node 22 or newer. In this environment:

```bash
export PATH=/home/drezvanova/.nvm/versions/node/v22.13.1/bin:$PATH
```

## Structure

```text
src/
  app/
  pages/
  widgets/
  features/
  entities/
  shared/
```

Imports use the `@/*` alias, configured in `vite.config.ts` and `tsconfig.app.json`.

## CTA sheet

CTA are loaded from the `cta` worksheet in the configured Google spreadsheet.
The first row must contain these headers:

| label | link | text | color | metrica |
| --- | --- | --- | --- | --- |
| Button label | `https://example.com` | Text next to the button | `#F2A045` | `cta_example` |

- `label` and `link` are required
- `text`, `color`, and `metrica` are optional
- `color` accepts a CSS hex color and can override a filled button; otherwise filled buttons alternate red and orange
- The final CTA is always transparent with a white border, so its `color` value is ignored
- `metrica` contains the Yandex Metrica JavaScript-event goal ID, not JavaScript or JSON
- The `link` cell must contain only a URL; keep the adjacent description in `text`

For every non-empty `metrica` value, create a matching JavaScript-event goal in
Yandex Metrica. A click sends
`ym(109600188, 'reachGoal', metrica, { cta: { label, link } })`.

## Google Calendar events

The home-page schedule is loaded from a public Google Calendar through Calendar
API v3. Set `VITE_GOOGLE_CALENDAR_ID` to the calendar ID. A separate
`VITE_GOOGLE_CALENDAR_API_KEY` is optional; when it is empty, the app reuses
`VITE_GOOGLE_SHEETS_API_KEY`. Enable both Google Sheets API and Google Calendar
API for the selected key and restrict it to the site HTTP referrers.

The event title comes from the Google Calendar event name. Start and end come
from the event parameters and are displayed in `Asia/Omsk`. Put this JSON in the
event description:

```json
{
  "type": "event",
  "text": "Описание с *важным выделением*",
  "buttons": [
    {
      "label": "Записаться",
      "link": "https://example.com/form",
      "color": "#FF6F6F",
      "metrica": "calendar_signup"
    }
  ]
}
```

- `type` is required: use `class` for a class or `event` for another event
- events without a JSON object in the description, with malformed JSON, or without a supported `type` are not displayed
- HTML markup automatically added by Google Calendar to line breaks and links is removed before parsing
- repeated spaces are normalized; all intentional `\n` sequences in `text`, including blank lines, are preserved
- `text` is optional and supports `*bold colored text*` and `**bold colored text**`
- `buttons` is optional and preserves the order from JSON
- every button requires `label` and an absolute `http(s)` link or a relative `/path`
- `color` accepts a CSS hex color and defaults to the event-type color
- `metrica` uses the same Yandex Metrica JavaScript goal IDs as other CTA
- descriptions and buttons are shown on hover or keyboard focus; on mobile, tap the event to expand it
- when a filter has no events, the current empty month and current empty mobile week are still displayed
- the mobile schedule is grouped into calendar weeks from Monday through Sunday
- mobile renders six weeks initially and reveals six more with the load-more button
- desktop uses a compact dotted calendar grid and shows only the start time with the event title on one line
- desktop hover details start with the full event date and start/end time in bold
- recurring events are expanded into occurrences; the app requests a 12-month window starting with the current Omsk month
