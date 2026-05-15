import type { ButtonHTMLAttributes } from 'react'

import './button.css'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  return <button className={`button button--${variant} ${className}`.trim()} {...props} />
}
