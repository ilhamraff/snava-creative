import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { Accordion } from '@/components/ui/accordion'
import { AnimatedSection } from '@/components/ui/animated-section'
import { faqItems } from '@/lib/data/faq'

export function FAQSection() {
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
            items={faqItems
              .sort((a, b) => a.order - b.order)
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
