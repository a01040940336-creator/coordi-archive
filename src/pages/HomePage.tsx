import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInfinitePosts } from '../hooks/usePosts'

const FALLBACK = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80',
  'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=900&q=80',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80',
]

function cover(post: any, fallback: string) {
  return (
    [...(post?.coordi_post_images || [])]
      .sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url || fallback
  )
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  const { data } = useInfinitePosts()
  const posts = data?.pages.flat() || []

  const p = (i: number) => posts[i] || null
  const img = (i: number) => cover(posts[i], FALLBACK[i] || FALLBACK[0])

  return (
    <main className="bg-canvas text-primary pt-12">

      {/* ─────────────────────────────────────────────────────────
          01 · HERO  — oversized typography + single image
      ───────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative grid grid-cols-1 md:grid-cols-[52%_48%] overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        {/* Left — massive type */}
        <div className="flex flex-col justify-between px-6 md:px-12 pt-10 pb-10 md:py-16 z-10">
          <p className="font-inter text-[9px] tracking-[0.55em] uppercase text-secondary">
            Vol. 01 · 2026 SS
          </p>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-inter font-black uppercase text-primary leading-[0.82] tracking-tight"
              style={{ fontSize: 'clamp(4.5rem, 12vw, 13rem)' }}
            >
              COORDI<br />ARCHIVE
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-inter text-xs text-secondary tracking-[0.25em] uppercase mt-6 max-w-xs leading-relaxed"
            >
              The archive of everyday style —<br />
              fashion editorial, curated.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10"
            >
              <Link
                to="/explore"
                className="font-inter text-[10px] tracking-[0.45em] uppercase text-primary border-b border-primary pb-px hover:text-secondary hover:border-secondary transition-colors"
              >
                Enter Archive →
              </Link>
            </motion.div>
          </div>

          <p className="font-inter text-[9px] tracking-[0.3em] uppercase text-secondary">
            Fashion Editorial Archive
          </p>
        </div>

        {/* Right — full-height image with parallax */}
        <div className="relative overflow-hidden" style={{ minHeight: '60vw' }}>
          <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
            <img src={img(0)} alt="" className="img-fill" />
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          Ticker
      ───────────────────────────────────────────────────────── */}
      <div className="border-y border-border overflow-hidden py-3">
        <div className="flex whitespace-nowrap marquee-left">
          {[...Array(14)].map((_, i) => (
            <span key={i} className="inline-block font-inter text-[9px] tracking-[0.5em] uppercase text-secondary px-10">
              Coordi Archive · Fashion Editorial · 2026 ·
            </span>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          02 · FEATURE LOOK — full bleed + big number
      ───────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-[38%_62%]" style={{ minHeight: '85vh' }}>

        {/* Left — editorial label */}
        <div className="flex flex-col justify-between px-6 md:px-12 py-14 border-r border-border">
          <div>
            <p className="font-inter text-[9px] tracking-[0.5em] uppercase text-secondary mb-2">Look</p>
            <FadeIn>
              <span
                className="font-inter font-black text-primary leading-none block"
                style={{ fontSize: 'clamp(6rem, 16vw, 18rem)', lineHeight: 0.85 }}
              >
                01
              </span>
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <div>
              {p(0) && (
                <>
                  <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-secondary mb-3">
                    {posts[0]?.coordi_post_temperature_tags?.[0]?.coordi_temperature_tags?.label || 'Editorial'}
                    {' · '}
                    {posts[0]?.coordi_post_season_tags?.[0]?.coordi_season_tags?.label || '2026'}
                  </p>
                  <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">
                    {posts[0]?.title || 'Editorial Look'}
                  </h2>
                  {posts[0]?.description && (
                    <p className="font-inter text-xs text-secondary leading-relaxed max-w-xs">
                      {posts[0].description}
                    </p>
                  )}
                </>
              )}
              <Link
                to={p(0) ? `/post/${posts[0].id}` : '/explore'}
                className="inline-block mt-6 font-inter text-[9px] tracking-[0.4em] uppercase text-primary border-b border-primary pb-px hover:text-secondary hover:border-secondary transition-colors"
              >
                View Look →
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Right — full bleed image */}
        <div className="relative overflow-hidden" style={{ minHeight: '65vw' }}>
          <motion.img
            src={img(0)}
            alt=""
            className="img-fill"
            initial={{ scale: 1.05, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          03 · STATEMENT TYPOGRAPHY — no images
      ───────────────────────────────────────────────────────── */}
      <section className="border-y border-border px-6 md:px-12 py-20 md:py-32">
        <FadeIn>
          <h2
            className="font-inter font-black uppercase text-primary leading-[0.88] tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 8rem)' }}
          >
            Real People.<br />Real Style.
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex items-end justify-between mt-8 md:mt-12">
            <p className="font-inter text-xs text-secondary tracking-[0.2em] max-w-xs leading-relaxed">
              온도, 계절, 스타일로 탐색하는<br />
              진짜 사람들의 코디를 에디토리얼로 기록합니다.
            </p>
            <Link
              to="/explore"
              className="font-inter text-[9px] tracking-[0.5em] uppercase text-secondary hover:text-primary transition-colors hidden md:block"
            >
              Explore All →
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ─────────────────────────────────────────────────────────
          04 · ASYMMETRIC SPREAD — looks 2 & 3
      ───────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-[58%_42%] border-b border-border">

        {/* Large left image */}
        <div className="relative overflow-hidden border-r border-border" style={{ minHeight: '75vh' }}>
          <motion.img
            src={img(1)}
            alt=""
            className="img-fill"
            initial={{ scale: 1.04, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
          {/* Caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-white/60 mb-1">Look 02</p>
                <p className="font-inter text-sm font-medium text-white">
                  {posts[1]?.title || 'Editorial'}
                </p>
              </div>
              <Link
                to={p(1) ? `/post/${posts[1].id}` : '/explore'}
                className="font-inter text-[9px] tracking-[0.4em] uppercase text-white/70 hover:text-white transition-colors"
              >
                →
              </Link>
            </div>
          </div>
        </div>

        {/* Right stack */}
        <div className="flex flex-col">
          {/* Top — smaller image */}
          <div className="relative overflow-hidden flex-1" style={{ minHeight: '38vh' }}>
            <motion.img
              src={img(2)}
              alt=""
              className="img-fill"
              initial={{ scale: 1.04, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.1, ease: 'easeOut' }}
            />
            <div className="absolute bottom-4 left-5">
              <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-white/60">Look 03</p>
            </div>
          </div>

          {/* Bottom — editorial text */}
          <div className="border-t border-border px-6 md:px-8 py-8 flex-1 flex flex-col justify-between" style={{ minHeight: '37vh' }}>
            <p className="font-inter text-[9px] tracking-[0.5em] uppercase text-secondary">
              2026 SS Collection
            </p>
            <FadeIn>
              <h3
                className="font-playfair font-bold text-primary italic leading-tight"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)' }}
              >
                "Autumn<br />Winter<br />Archive"
              </h3>
            </FadeIn>
            <Link
              to="/explore"
              className="font-inter text-[9px] tracking-[0.4em] uppercase text-secondary hover:text-primary transition-colors"
            >
              View Archive →
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          05 · LOOK 04 — offset center composition
      ───────────────────────────────────────────────────────── */}
      <section className="border-b border-border py-16 md:py-24 px-6 md:px-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="font-inter text-[9px] tracking-[0.5em] uppercase text-secondary mb-1">Look</p>
            <span
              className="font-inter font-black text-primary leading-none block"
              style={{ fontSize: 'clamp(3rem, 8vw, 9rem)', lineHeight: 0.85 }}
            >
              04
            </span>
          </div>
          {p(3) && (
            <div className="text-right hidden md:block">
              <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-secondary mb-1">
                {posts[3]?.coordi_post_style_tags?.[0]?.coordi_style_tags?.label || 'Style'}
              </p>
              <p className="font-playfair text-lg font-medium text-primary italic">
                {posts[3]?.title}
              </p>
            </div>
          )}
        </div>

        {/* Offset image — pushed right */}
        <FadeIn>
          <div className="md:ml-[25%] relative overflow-hidden" style={{ height: 'clamp(320px, 60vh, 700px)' }}>
            <img src={img(3)} alt="" className="img-fill" />
          </div>
        </FadeIn>

        <div className="flex justify-end mt-6">
          <Link
            to={p(3) ? `/post/${posts[3].id}` : '/explore'}
            className="font-inter text-[9px] tracking-[0.4em] uppercase text-secondary hover:text-primary transition-colors"
          >
            View Look →
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          06 · THREE-LOOK EDITORIAL STRIP
      ───────────────────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="px-6 md:px-12 py-8 border-b border-border">
          <FadeIn>
            <h2
              className="font-inter font-black uppercase text-primary tracking-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 6rem)', lineHeight: 0.9 }}
            >
              Back to<br />Basics
            </h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-3">
          {[4, 5, 6].map((idx, i) => (
            <div
              key={idx}
              className={`relative overflow-hidden ${i < 2 ? 'border-r border-border' : ''}`}
              style={{ height: 'clamp(260px, 48vh, 600px)' }}
            >
              <motion.img
                src={img(idx)}
                alt=""
                className="img-fill grayscale hover:grayscale-0 transition-all duration-700"
                initial={{ scale: 1.06, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
              />
              <div className="absolute bottom-4 left-4">
                <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-white/60">
                  Look {String(idx + 1).padStart(2, '0')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          07 · DARK STATEMENT
      ───────────────────────────────────────────────────────── */}
      <section className="bg-primary px-6 md:px-12 py-20 md:py-28">
        <FadeIn>
          <p className="font-inter text-[9px] tracking-[0.55em] uppercase text-white/30 mb-8">
            Editorial Concept
          </p>
          <h2
            className="font-inter font-black uppercase text-white leading-[0.85] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 8vw, 10rem)' }}
          >
            Curated.<br />Archived.<br />Worn.
          </h2>
        </FadeIn>
        <FadeIn delay={0.25}>
          <div className="flex items-end justify-between mt-12 md:mt-16 border-t border-white/10 pt-8">
            <p className="font-inter text-xs text-white/40 tracking-[0.2em] max-w-sm leading-relaxed">
              패션 매거진의 경험을 일상으로. 온도, 계절, 스타일로 탐색하는 진짜 사람들의 코디를 에디토리얼 아카이브로 기록합니다.
            </p>
            <Link
              to="/explore"
              className="font-inter text-[9px] tracking-[0.45em] uppercase text-white/50 hover:text-white transition-colors hidden md:block"
            >
              Enter Archive →
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ─────────────────────────────────────────────────────────
          08 · ARCHIVE CTA — typographic
      ───────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 md:py-36 border-b border-border">
        <FadeIn>
          <Link to="/explore" className="group block">
            <h2
              className="font-inter font-black uppercase text-primary tracking-tight leading-[0.85] group-hover:text-secondary transition-colors duration-500"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 11rem)' }}
            >
              Explore<br />the Full<br />Archive
            </h2>
            <div className="flex items-center gap-4 mt-8">
              <span className="block w-12 h-px bg-primary group-hover:w-20 transition-all duration-500" />
              <span className="font-inter text-[9px] tracking-[0.5em] uppercase text-secondary group-hover:text-primary transition-colors">
                View All Looks
              </span>
            </div>
          </Link>
        </FadeIn>
      </section>

    </main>
  )
}
