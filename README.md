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
