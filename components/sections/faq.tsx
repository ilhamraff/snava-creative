import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { Accordion } from '@/components/ui/accordion'
import { AnimatedSection } from '@/components/ui/animated-section'
import { faqItems as defaultFaqItems } from '@/lib/data/faq'

interface FAQSectionProps {
  items?: { question: string; answer: string; order?: number }[]
}

export function FAQSection({ items = defaultFaqItems }: FAQSectionProps) {
  return (
    <AnimatedSection id="faq" className="py-20 lg:py-28 border-t border-border/50">
      <Container>
        <SectionHeader
          eyebrow="FAQ"
          title="Pertanyaan yang Sering Diajukan"
          subtitle="Temukan jawaban untuk pertanyaan umum tentang layanan kami."
        />

        <div className="mx-auto max-w-3xl">
          <Accordion
            items={items
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item) => ({
                question: item.question,
                answer: item.answer,
              }))}
          />
        </div>
      </Container>
    </AnimatedSection>
  )
}
