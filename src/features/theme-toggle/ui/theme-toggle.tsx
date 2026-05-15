import { useEffect, useState } from 'react'

import { Button } from '@/shared/ui/button'

type Theme = 'light' | 'dark'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </Button>
  )
}
