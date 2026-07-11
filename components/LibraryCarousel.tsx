'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Archive, ArrowLeft, ArrowRight, BookOpen, GraduationCap, Handshake } from 'lucide-react'

type Slide = {
  id: string
  number: string
  label: string
  title: string
  description: string
  cta: string
  href: string
  accent: string
  backdrop: string
  Icon: typeof Archive
}

const slides: Slide[] = [
  { id: 'repository', number: '01', label: 'Culture held with intention', title: 'Repository', description: 'Preserve culturally specific work, stories, and memory—and keep them discoverable in the communities that made them.', cta: 'Explore Repository', href: '/catalog', accent: '#d7b56d', backdrop: 'from-[#0b1119] via-[#17202a] to-[#3b2d1d]', Icon: Archive },
  { id: 'training', number: '02', label: 'Knowledge shared forward', title: 'Archival training', description: 'Build community skill in describing, digitizing, caring for, and activating collections across generations.', cta: 'Start Training', href: '/portal', accent: '#bfc8aa', backdrop: 'from-[#091411] via-[#183127] to-[#2d3a26]', Icon: GraduationCap },
  { id: 'marketplace', number: '03', label: 'Creative paths opened', title: 'Marketplace bridge', description: 'Connect community creators and the work they steward to aligned opportunities, teaching, and sustainable exchange.', cta: 'Browse Opportunities', href: '/catalog', accent: '#d4a7a0', backdrop: 'from-[#160e15] via-[#382031] to-[#4c2925]', Icon: Handshake },
]

export function CarouselItem({ slide, active }: { slide: Slide; active: boolean }) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (active) headingRef.current?.focus({ preventScroll: true })
  }, [active])

  return (
    <article aria-hidden={!active} className={`absolute inset-0 overflow-hidden bg-gradient-to-br ${slide.backdrop} transition-all duration-700 ease-out ${active ? 'z-10 opacity-100' : 'pointer-events-none opacity-0'}`}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 72% 32%, rgba(255,255,255,.16), transparent 24%), linear-gradient(115deg, transparent 45%, rgba(255,255,255,.04) 45%, rgba(255,255,255,.04) 46%, transparent 46%)' }} />
      <slide.Icon aria-hidden="true" className="absolute right-[-8vw] top-[14vh] h-[58vw] max-h-[650px] w-[58vw] max-w-[650px] stroke-[0.45] opacity-[0.09]" />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/35 transition-transform duration-1000 ${active ? 'scale-100' : 'scale-105'}`} />
      <div className="absolute bottom-24 left-6 z-10 max-w-3xl sm:bottom-28 sm:left-12 lg:bottom-24 lg:left-[8vw]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em]" style={{ color: slide.accent }}>{slide.label}</p>
        <h1 ref={headingRef} tabIndex={active ? -1 : undefined} className="mt-4 text-5xl font-medium leading-[0.94] outline-none sm:text-7xl lg:text-[7rem]">{slide.title}</h1>
        <p className="mt-5 max-w-xl text-sm leading-6 text-white/68 sm:text-base sm:leading-7">{slide.description}</p>
        <Link href={slide.href} tabIndex={active ? undefined : -1} className="mt-7 inline-flex items-center gap-4 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111820] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{slide.cta}<ArrowRight className="h-4 w-4" /></Link>
      </div>
    </article>
  )
}

export function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const goTo = useCallback((index: number) => setActiveIndex((index + slides.length) % slides.length), [])
  const previous = useCallback(() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length), [])
  const next = useCallback(() => setActiveIndex((current) => (current + 1) % slides.length), [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') previous()
      if (event.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, previous])

  return (
    <section aria-roledescription="carousel" aria-label="BEAM Library entry ways" className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#080d13] text-white">
      <nav aria-label="Homepage navigation" className="absolute inset-x-0 top-0 z-30 flex items-start gap-4 px-5 py-5 sm:px-8 sm:py-7">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]"><BookOpen className="h-4 w-4 text-grounds-sand" />BEAM <span className="text-white/45">Library</span></Link>
        <div className="ml-auto hidden items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-md md:flex">{slides.map((slide, index) => <button key={slide.id} type="button" onClick={() => goTo(index)} aria-pressed={activeIndex === index} className={`rounded-full px-4 py-2 text-xs transition ${activeIndex === index ? 'bg-white text-[#111820]' : 'text-white/65 hover:text-white'}`}>{slide.title}</button>)}</div>
        <div className="ml-auto flex shrink-0 items-center gap-3 text-xs sm:gap-5"><Link href="/about" className="hidden text-white/65 hover:text-white sm:block">About</Link><Link href="/catalog" className="hidden text-white/65 hover:text-white sm:block">Catalog</Link><Link href="/portal" className="rounded-full border border-white/25 bg-black/20 px-4 py-2 font-semibold backdrop-blur-md hover:bg-white hover:text-[#111820]">Portal</Link></div>
      </nav>

      <div className="absolute left-5 right-5 top-20 z-30 flex gap-2 overflow-x-auto pb-2 md:hidden">{slides.map((slide, index) => <button key={slide.id} type="button" onClick={() => goTo(index)} aria-pressed={activeIndex === index} className={`whitespace-nowrap rounded-full border px-3 py-2 text-[0.65rem] transition ${activeIndex === index ? 'border-white bg-white text-[#111820]' : 'border-white/20 bg-black/20 text-white/70 backdrop-blur-md'}`}>{slide.title}</button>)}</div>

      <div aria-live="polite">{slides.map((slide, index) => <CarouselItem key={slide.id} slide={slide} active={index === activeIndex} />)}</div>
      <p className="absolute right-6 top-36 z-20 text-xs tracking-[0.22em] text-white/50 sm:right-10 sm:top-28"><span className="text-white">{slides[activeIndex].number}</span> / 03</p>

      <button type="button" onClick={previous} aria-label="Previous slide" className="absolute left-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/20 backdrop-blur transition hover:bg-white hover:text-black sm:left-8"><ArrowLeft className="h-4 w-4" /></button>
      <button type="button" onClick={next} aria-label="Next slide" className="absolute right-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/20 backdrop-blur transition hover:bg-white hover:text-black sm:right-8"><ArrowRight className="h-4 w-4" /></button>
      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2" role="group" aria-label="Choose a slide">{slides.map((slide, index) => <button key={slide.id} type="button" onClick={() => goTo(index)} aria-label={`Go to ${slide.title}`} aria-current={activeIndex === index ? 'true' : undefined} className={`h-2 rounded-full transition-all ${activeIndex === index ? 'w-7 bg-white' : 'w-2 bg-white/35 hover:bg-white/65'}`} />)}</div>
    </section>
  )
}
