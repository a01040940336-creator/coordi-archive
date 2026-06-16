import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInfinitePosts } from '../hooks/usePosts'

function cover(post: any) {
  return [...(post.coordi_post_images || [])]
    .sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url || ''
}

function EditorialNum({ n }: { n: number }) {
  return (
    <span
      className="font-inter font-black text-primary leading-none select-none"
      style={{ fontSize: 'clamp(4rem, 10vw, 11rem)', lineHeight: 0.85 }}
    >
      {String(n).padStart(2, '0')}
    </span>
  )
}

function LookCard({ post, index }: { post: any; index: number }) {
  const img = cover(post)
  const num = post.editorial_number || index + 1
  const temp = post.coordi_post_temperature_tags?.[0]?.coordi_temperature_tags?.label || ''
  const season = post.coordi_post_season_tags?.[0]?.coordi_season_tags?.label || ''
  const style = post.coordi_post_style_tags?.[0]?.coordi_style_tags?.label || ''

  return (
    <Link to={`/post/${post.id}`} className="group block h-full">
      <div className="relative overflow-hidden w-full h-full bg-stone-100">
        {img && (
          <motion.img
            src={img}
            alt={post.title}
            className="img-fill"
            initial={{ scale: 1.05, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
          />
        )}
        {/* Hover reveal */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
          <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-white/70 mb-1">
            No.{String(num).padStart(3, '0')} {temp && `· ${temp}`}
          </p>
          <p className="font-inter text-sm font-medium text-white leading-snug">{post.title}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-start">
        <div>
          <p className="font-inter text-[9px] tracking-[0.35em] uppercase text-secondary mb-1">
            No.{String(num).padStart(3, '0')}
          </p>
          <p className="font-playfair text-base font-medium text-primary leading-snug group-hover:text-secondary transition-colors">
            {post.title}
          </p>
        </div>
        {style && (
          <span className="font-inter text-[8px] tracking-[0.2em] uppercase text-secondary border border-border px-2 py-1 shrink-0 mt-0.5">
            {style}
          </span>
        )}
      </div>
      {season && (
        <p className="font-inter text-[9px] tracking-[0.2em] uppercase text-secondary mt-1">{season}</p>
      )}
    </Link>
  )
}

export default function ExplorePage() {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePosts()
  const posts = data?.pages.flat() || []

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    const obs = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (loadMoreRef.current) obs.observe(loadMoreRef.current)
    return () => obs.disconnect()
  }, [handleObserver])

  if (isLoading) {
    return (
      <div className="pt-12 bg-canvas min-h-screen">
        <div className="px-6 md:px-10 py-16 border-b border-border">
          <div className="h-px w-0 bg-primary animate-pulse" style={{ width: '60%' }} />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-border" style={{ height: '60vh' }}>
            <div className="w-full h-full bg-stone-100 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  // ── Empty state ──
  if (posts.length === 0) {
    return (
      <div className="pt-12 bg-canvas min-h-screen">
        <section className="px-6 md:px-10 py-24 border-b border-border">
          <p className="font-inter text-[9px] tracking-[0.55em] uppercase text-secondary mb-3">The Archive</p>
          <h1
            className="font-inter font-black uppercase text-primary tracking-tight leading-[0.85]"
            style={{ fontSize: 'clamp(4rem, 11vw, 12rem)' }}
          >
            Explore
          </h1>
          <p className="font-inter text-xs text-secondary mt-6 tracking-[0.2em]">
            No looks archived yet — be the first to upload.
          </p>
        </section>
        <section className="border-b border-border" style={{ height: '60vh' }}>
          <div className="w-full h-full bg-stone-100 opacity-30" />
        </section>
      </div>
    )
  }

  return (
    <main className="pt-12 bg-canvas text-primary">

      {/* ── PAGE HEADER ── */}
      <section className="px-6 md:px-10 py-14 md:py-20 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-inter text-[9px] tracking-[0.55em] uppercase text-secondary mb-3">
              The Archive
            </p>
            <h1
              className="font-inter font-black uppercase text-primary tracking-tight leading-[0.85]"
              style={{ fontSize: 'clamp(4rem, 11vw, 12rem)' }}
            >
              Explore
            </h1>
          </div>
          <p className="font-inter text-[9px] tracking-[0.3em] uppercase text-secondary pb-2">
            {posts.length} looks archived
          </p>
        </div>
      </section>

      {/* ── EDITORIAL LAYOUT ── */}
      {posts.length > 0 && (
        <>
          {/* A: First look — full width, tall */}
          <section className="border-b border-border">
            <div
              className="relative overflow-hidden"
              style={{ height: 'clamp(50vh, 75vh, 90vh)' }}
            >
              <LookCard post={posts[0]} index={0} />
            </div>
          </section>

          {/* B: Looks 2 & 3 — asymmetric 60/40 */}
          {posts.length >= 2 && (
            <section className="grid grid-cols-1 md:grid-cols-[60%_40%] border-b border-border">
              <div className="relative overflow-hidden border-r border-border" style={{ height: 'clamp(40vh, 65vh, 80vh)' }}>
                <LookCard post={posts[1]} index={1} />
              </div>
              <div className="flex flex-col">
                {/* Top: number */}
                <div className="border-b border-border px-6 md:px-8 py-8">
                  <EditorialNum n={2} />
                </div>
                {/* Bottom: look 3 */}
                {posts[2] && (
                  <div className="relative overflow-hidden flex-1" style={{ minHeight: '36vh' }}>
                    <LookCard post={posts[2]} index={2} />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* C: Typography break */}
          <section className="border-b border-border px-6 md:px-10 py-12 md:py-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="font-inter font-black uppercase text-primary tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 8rem)', lineHeight: 0.88 }}
            >
              2026 SS<br />Collection
            </motion.p>
          </section>

          {/* D: Looks 4-5-6 — 3 columns */}
          {posts.length >= 4 && (
            <section className="grid grid-cols-3 border-b border-border">
              {posts.slice(3, 6).map((post, i) => (
                <div
                  key={post.id}
                  className={`relative overflow-hidden ${i < 2 ? 'border-r border-border' : ''}`}
                  style={{ height: 'clamp(260px, 50vh, 65vh)' }}
                >
                  <LookCard post={post} index={i + 3} />
                </div>
              ))}
            </section>
          )}

          {/* E: Look 7 — left-offset large */}
          {posts[6] && (
            <section className="border-b border-border grid grid-cols-1 md:grid-cols-[20%_80%]">
              {/* left: label */}
              <div className="border-r border-border px-6 md:px-8 py-10 flex flex-col justify-between hidden md:flex">
                <EditorialNum n={7} />
                <p className="font-inter text-[9px] tracking-[0.45em] uppercase text-secondary">
                  {posts[6]?.coordi_post_style_tags?.[0]?.coordi_style_tags?.label || 'Look'}
                </p>
              </div>
              {/* right: image */}
              <div className="relative overflow-hidden" style={{ height: 'clamp(45vh, 70vh, 85vh)' }}>
                <LookCard post={posts[6]} index={6} />
              </div>
            </section>
          )}

          {/* F: Look 8 — right-offset */}
          {posts[7] && (
            <section className="border-b border-border grid grid-cols-1 md:grid-cols-[75%_25%]">
              <div className="relative overflow-hidden border-r border-border" style={{ height: 'clamp(45vh, 68vh, 82vh)' }}>
                <LookCard post={posts[7]} index={7} />
              </div>
              <div className="px-6 md:px-8 py-10 flex flex-col justify-between">
                <p className="font-inter text-[9px] tracking-[0.5em] uppercase text-secondary">Archive</p>
                <EditorialNum n={8} />
              </div>
            </section>
          )}

          {/* G: Remaining looks — narrow editorial list */}
          {posts.length > 8 && (
            <section className="border-b border-border">
              <div className="px-6 md:px-10 py-8 border-b border-border">
                <p className="font-inter font-black uppercase text-primary tracking-tight"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 5rem)', lineHeight: 0.9 }}>
                  All Looks
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4">
                {posts.slice(8).map((post, i) => (
                  <div
                    key={post.id}
                    className={`relative overflow-hidden border-b border-border ${
                      (i % 4) < 3 ? 'border-r' : ''
                    } border-border`}
                    style={{ height: 'clamp(220px, 38vh, 50vh)' }}
                  >
                    <LookCard post={post} index={i + 8} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-20 text-center">
        {isFetchingNextPage && (
          <p className="font-inter text-[9px] tracking-[0.5em] uppercase text-secondary animate-pulse">
            Loading
          </p>
        )}
      </div>

    </main>
  )
}
