'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-surface overflow-hidden transition-colors hover:border-charcoal/40"
        >
          <button
            onClick={() => toggle(index)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left text-foreground font-medium transition-colors cursor-pointer"
            aria-expanded={openIndex === index}
          >
            <span className="text-[15px] leading-snug">{item.question}</span>
            <ChevronDown
              className={cn(
                'h-5 w-5 shrink-0 text-muted transition-transform duration-300',
                openIndex === index && 'rotate-180 text-accent'
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <div className="px-5 pb-5 text-muted text-[15px] leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
