import { Container } from '@/components/ui/container'
import { AnimatedSection } from '@/components/ui/animated-section'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export interface ServiceProblemsProps {
  headline: string
  problems: { title: string; description: string }[]
  solutionText?: string
}

export function ServiceProblems({
  headline,
  problems,
  solutionText,
}: ServiceProblemsProps) {
  if (!problems || problems.length === 0) return null

  return (
    <AnimatedSection className="py-24 lg:py-32 bg-surface">
      <Container>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl lg:text-5xl font-medium tracking-tight text-foreground leading-tight">
            {headline}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div key={index} className="flex gap-6 items-start">
              <div className="shrink-0 mt-1 text-accent">
                <AlertCircle className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium text-foreground mb-3">
                  {problem.title}
                </h3>
                <p className="text-base text-muted font-light leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {solutionText && (
          <div className="mt-20 max-w-3xl mx-auto p-8 md:p-10 bg-background border border-border/50 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-foreground" />
            </div>
            <p className="font-sans text-lg md:text-xl font-light text-foreground leading-relaxed">
              {solutionText}
            </p>
          </div>
        )}
      </Container>
    </AnimatedSection>
  )
}
