import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInfinitePosts } from '../hooks/usePosts'
import PostCard from '../components/post/PostCard'

const COVER_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80'
const EDITORIAL_IMG1 = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'
const EDITORIAL_IMG2 = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
const EDITORIAL_IMG3 = 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80'

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const { data, isLoading } = useInfinitePosts()
  const allPosts = data?.pages.flat() || []

  return (
    <main>
      {/* Hero — Magazine Cover */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src={COVER_IMAGE}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative h-full flex flex-col justify-between px-8 md:px-16 py-12"
        >
          {/* Top bar */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-inter text-[10px] text-white/60 tracking-[0.4em] uppercase">
                Summer Issue 2026
              </p>
            </div>
            <div className="text-right">
              <p className="font-inter text-[10px] text-white/60 tracking-[0.3em] uppercase">
                28~31℃ · Rainy Season
              </p>
            </div>
          </div>

          {/* Center content */}
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-playfair text-[clamp(3rem,10vw,9rem)] font-bold text-white leading-none tracking-tight"
              >
                Coordi<br />Archive
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-inter text-sm text-white/70 tracking-[0.3em] uppercase mt-4"
              >
                The Archive of Everyday Style.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col items-end gap-4"
            >
              <div className="text-vertical font-inter text-[10px] text-white/40 tracking-widest uppercase hidden md:block">
                Fashion Editorial Archive
              </div>
              <Link
                to="/explore"
                className="inline-block font-inter text-xs tracking-[0.3em] uppercase text-white border border-white/60 px-8 py-3 hover:bg-white hover:text-primary transition-all duration-300"
              >
                Explore
              </Link>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-px h-12 bg-white/40" />
              <p className="font-inter text-[9px] text-white/40 tracking-[0.3em] uppercase">Scroll</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Latest Editorial — Asymmetric Layout */}
      <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-2">
              001
            </p>
            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-primary">
              Latest<br />Editorial
            </h2>
          </div>
          <Link
            to="/explore"
            className="font-inter text-xs tracking-widest uppercase text-secondary hover:text-primary transition-colors hidden md:block"
          >
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Large feature post */}
            {allPosts[0] && (
              <div className="md:col-span-7">
                <PostCard post={allPosts[0]} index={0} variant="large" />
              </div>
            )}
            {/* Stack of 2 */}
            <div className="md:col-span-5 grid grid-rows-2 gap-4">
              {allPosts[1] && <PostCard post={allPosts[1]} index={1} variant="large" />}
              {allPosts[2] && <PostCard post={allPosts[2]} index={2} variant="large" />}
            </div>
          </div>
        )}
      </section>

      {/* Editorial Statement — Full width text */}
      <section className="py-20 px-6 md:px-16 bg-primary">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-white/40 mb-6">
                002 · Editorial Concept
              </p>
              <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white leading-tight">
                "Real People,<br />Real Style."
              </h2>
            </div>
            <div>
              <p className="font-inter text-sm text-white/60 leading-relaxed tracking-wide">
                Coordi Archive는 패션 매거진의 경험을 일상으로 가져옵니다.
                온도, 계절, 스타일로 탐색하는 진짜 사람들의 코디를
                에디토리얼 아카이브로 기록합니다.
              </p>
              <Link
                to="/explore"
                className="inline-block mt-8 font-inter text-xs tracking-[0.3em] uppercase text-white border-b border-white/40 pb-1 hover:border-white transition-colors"
              >
                Enter the Archive
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editor's Pick — 3-column Grid */}
      <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-2">003</p>
          <div className="flex items-end justify-between">
            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-primary">
              Editor's Pick
            </h2>
            <div className="hidden md:block text-vertical font-inter text-[10px] text-secondary tracking-[0.3em] uppercase mb-2">
              Selected Looks
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allPosts.slice(3, 6).map((post, i) => (
            <PostCard key={post.id} post={post} index={i} variant="large" />
          ))}
        </div>
      </section>

      {/* Photo feature — Broken Grid */}
      <section className="py-16 overflow-hidden">
        <div className="grid grid-cols-3 gap-2">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="col-span-2 aspect-[16/9]"
          >
            <img src={EDITORIAL_IMG1} alt="Editorial" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col gap-2">
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex-1"
            >
              <img src={EDITORIAL_IMG2} alt="Editorial" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1"
            >
              <img src={EDITORIAL_IMG3} alt="Editorial" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Looks */}
      <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-2">004</p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-primary">
            Trending Looks
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allPosts.slice(6, 10).map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </section>

      {/* Most Saved */}
      <section className="py-16 px-6 md:px-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-2">005</p>
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary">Most Saved</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-border">
            {allPosts.slice(10, 16).map((post, i) => (
              <PostCard key={post.id} post={post} index={i} variant="minimal" />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/explore"
              className="inline-block font-inter text-xs tracking-[0.3em] uppercase text-primary border border-primary px-12 py-4 hover:bg-primary hover:text-white transition-all duration-300"
            >
              View Full Archive
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
