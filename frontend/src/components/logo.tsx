import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

export type LogoProps = HTMLAttributes<HTMLSpanElement> & {
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Logo({ className, size = 'md', ...rest }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center', className)} {...rest}>
      <Icons.logo className={sizeMap[size]} />
    </span>
  )
}
