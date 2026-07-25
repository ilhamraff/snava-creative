'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Container } from '@/components/ui/container'
import { testimonials } from '@/lib/data/testimonials'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrent((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % testimonials.length
      }
      return (prev - 1 + testimonials.length) % testimonials.length
    })
  }, [])

  const testimonial = testimonials[current]

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
    }),
  }

  return (
    <section id="testimoni" className="py-24 lg:py-32 bg-background border-t border-border/20">
      <Container>
        <div className="relative mx-auto max-w-5xl">
          
          <div className="mb-16 flex items-center gap-6">
            <h2 className="font-display text-2xl md:text-3xl text-foreground font-medium">Client Stories</h2>
            <div className="h-[1px] flex-1 bg-border/50" />
            <div className="flex gap-2">
              <button
                onClick={() => paginate(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-foreground transition-all hover:bg-foreground hover:text-background cursor-pointer"
                aria-label="Testimoni sebelumnya"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-foreground transition-all hover:bg-foreground hover:text-background cursor-pointer"
                aria-label="Testimoni berikutnya"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden py-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col md:flex-row gap-12 lg:gap-20"
              >
                <blockquote className="flex-1 font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground leading-[1.3] tracking-tight">
                  "{testimonial.content}"
                </blockquote>

                <div className="w-full md:w-64 shrink-0 flex flex-col justify-end pb-2">
                  <p className="font-display text-lg font-medium text-foreground mb-1">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted uppercase tracking-wider font-light">
                    {testimonial.role}<br/>
                    {testimonial.company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </Container>
    </section>
  )
}
