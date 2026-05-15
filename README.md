# Jazz Time

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
