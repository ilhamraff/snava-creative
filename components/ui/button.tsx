import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { isExternalHref, resolveSiteHref } from '@/lib/utils/href'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-none font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-white hover:bg-accent-light active:bg-accent-dark shadow-lg shadow-accent/20 hover:shadow-accent/30',
        secondary:
          'border border-border text-foreground hover:bg-surface-elevated hover:border-charcoal',
        ghost: 'text-muted hover:text-foreground hover:bg-surface-elevated',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonBaseProps extends VariantProps<typeof buttonVariants> {
  className?: string
  children: React.ReactNode
}

type ButtonLinkProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href'> & {
    href: string
  }

type NativeButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    href?: never
  }

export type ButtonProps = ButtonLinkProps | NativeButtonProps

export function Button(props: ButtonProps) {
  const { className, variant, size, href, children, ...elementProps } = props

  if (href) {
    const resolvedHref = resolveSiteHref(href)
    const linkProps = elementProps as React.AnchorHTMLAttributes<HTMLAnchorElement>

    if (!isExternalHref(resolvedHref)) {
      return (
        <Link
          href={resolvedHref}
          className={cn(buttonVariants({ variant, size }), className)}
          {...linkProps}
        >
          {children}
        </Link>
      )
    }

    return (
      <a
        href={resolvedHref}
        target={resolvedHref.startsWith('http') ? '_blank' : undefined}
        rel={resolvedHref.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...linkProps}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...(elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}

export { buttonVariants }
