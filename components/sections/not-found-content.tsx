import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'

export function NotFoundContent() {
  return (
    <section className="flex min-h-svh items-center bg-background pb-16 pt-28 sm:pt-32">
      <Container>
        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground/70">
            <span>404 / Tidak ditemukan</span>
            <span className="hidden sm:inline">Snava Creative</span>
          </div>

          <div className="mt-12 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-end lg:gap-10">
            <p
              aria-hidden="true"
              className="font-display text-[clamp(6rem,23vw,18rem)] font-medium leading-[0.8] tracking-[-0.09em] text-foreground"
            >
              404<span className="text-accent">.</span>
            </p>

            <div className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pb-2 lg:pl-10 lg:pt-0">
              <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
                Halaman tidak ditemukan.
              </h1>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-foreground/70">
                Alamat yang Anda buka tidak mengarah ke halaman yang tersedia.
              </p>

              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-start">
                <Button
                  href="/"
                  size="lg"
                  className="bg-foreground px-7 text-background shadow-none hover:bg-foreground/90 hover:shadow-none active:bg-foreground/80"
                >
                  Kembali ke beranda
                </Button>
                <Link
                  href="/portfolio"
                  className="inline-flex min-h-11 items-center border-b border-foreground/30 text-sm font-medium text-foreground transition-colors hover:border-accent"
                >
                  Lihat portofolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
