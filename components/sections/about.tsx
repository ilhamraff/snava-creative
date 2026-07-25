import { Container } from '@/components/ui/container'
import { aboutData } from '@/lib/data/about'

export function AboutSection() {
  return (
    <section id="tentang" className="py-24 lg:py-32 bg-foreground text-background">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-12 leading-[1.2]">
            {aboutData.title}
          </h2>
          
          <div className="font-sans text-lg md:text-xl lg:text-2xl font-light text-background/80 leading-relaxed mb-16">
            <p className="mb-6">{aboutData.description}</p>
            <p>{aboutData.vision}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 text-left pt-16 border-t border-background/20">
            {aboutData.values.map((value) => (
              <div key={value.title} className="group">
                <h3 className="font-display text-xl font-medium mb-3 group-hover:text-background/70 transition-colors">
                  {value.title}
                </h3>
                <p className="text-sm md:text-base font-light text-background/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
