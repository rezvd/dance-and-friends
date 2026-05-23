/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SHEETS_API_KEY?: string
  readonly VITE_GOOGLE_SHEETS_SPREADSHEET_ID?: string
  readonly VITE_VK_GROUP_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
