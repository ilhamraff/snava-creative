import Image from 'next/image'

interface AdminLogoProps {
  className?: string
  priority?: boolean
}

export function AdminLogo({ className = '', priority = false }: AdminLogoProps) {
  return (
    <span className={`admin-logo relative inline-block aspect-[2379/835] ${className}`}>
      <Image
        src="/assets/logo-black.png"
        alt="Snava Creative"
        fill
        priority={priority}
        sizes="(max-width: 768px) 144px, 176px"
        className="admin-logo-light object-contain object-left"
      />
      <Image
        src="/assets/logo-white.png"
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 768px) 144px, 176px"
        className="admin-logo-dark object-contain object-left"
        aria-hidden="true"
      />
    </span>
  )
}
