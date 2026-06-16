import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInfinitePosts } from '../hooks/usePosts'

const FEATURE_IMG = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80'

export default function HomePage() {
  const { data, isLoading } = useInfinitePosts()
  const allPosts = data?.pages.flat() || []

  const getCover = (post: any) =>
    [...(post.coordi_post_images || [])]
      .sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url || FEATURE_IMG

  const thumb1 = allPosts[1] ? getCover(allPosts[1]) : 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80'
  const thumb2 = allPosts[2] ? getCover(allPosts[2]) : 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80'
  const thumb3 = allPosts[3] ? getCover(allPosts[3]) : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80'

  const lineup = allPosts.length > 0 ? allPosts : Array(8).fill(null)
  const gridPosts = allPosts.slice(0, 8)

  return (
    <main className="pt-14 min-h-screen bg-white overflow-x-hidden">

      {/* ── MARQUEE TICKER ────────────────────────────────────── */}
      <div className="border-b border-border overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
          className="flex whitespace-nowrap"
        >
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="inline-block font-inter text-[10px] tracking-[0.55em] uppercase text-secondary px-12 py-2.5 border-r border-border"
            >
              LOOK DISPLAY
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── HERO: 라인업 + 에디토리얼 ────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-[62%_38%] border-b border-border"
        style={{ minHeight: '72vh' }}>

        {/* 좌측 — 모델 라인업 */}
        <div className="relative flex flex-col border-r border-border overflow-hidden">

          {/* LOOK DISPLAY 상단 레이블 4개 */}
          <div className="flex justify-between px-6 py-3 border-b border-border shrink-0">
            {['LOOK DISPLAY', 'LOOK DISPLAY', 'LOOK DISPLAY', 'LOOK DISPLAY'].map((t, i) => (
              <span key={i} className="font-inter text-[9px] tracking-[0.4em] uppercase text-secondary">
                {t}
              </span>
            ))}
          </div>

          {/* 가로 스크롤 모델 라인업 */}
          <div className="flex-1 flex items-center px-4 overflow-x-auto gap-1 scrollbar-hide py-8">
            {isLoading
              ? [...Array(8)].map((_, i) => (
                  <div key={i} className="shrink-0 w-28 h-64 bg-gray-100 animate-pulse" />
                ))
              : lineup.slice(0, 12).map((post, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="shrink-0 group cursor-pointer"
                  >
                    <Link to={post ? `/post/${post.id}` : '/explore'}>
                      <div
                        className="overflow-hidden bg-gray-50 transition-all duration-500 group-hover:shadow-lg"
                        style={{ width: '108px', height: '256px' }}
                      >
                        <img
                          src={post ? getCover(post) : FEATURE_IMG}
                          alt={post?.title || ''}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>

        {/* 우측 — 에디토리얼 대형 사진 */}
        <div className="relative overflow-hidden bg-gray-900" style={{ minHeight: '55vw' }}>
          <img
            src={allPosts[0] ? getCover(allPosts[0]) : FEATURE_IMG}
            alt="Feature"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

          {/* 브랜드명 */}
          <div className="absolute top-8 left-6 right-6">
            <h1
              className="font-playfair font-black text-white leading-[0.85] uppercase"
              style={{ fontSize: 'clamp(1.6rem, 3.2vw, 3.2rem)', letterSpacing: '-0.01em' }}
            >
              COORDI<br />ARCHIVE
            </h1>
          </div>

          {/* 폴라로이드 썸네일 3장 */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5">
            {[thumb1, thumb2, thumb3].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                className="bg-white p-1.5 shadow-xl"
                style={{ width: '80px' }}
              >
                <div className="overflow-hidden" style={{ height: '56px' }}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 하단 연도 */}
          <div className="absolute bottom-5 left-6">
            <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-white/50">
              2026 SS Collection
            </p>
          </div>
        </div>
      </section>

      {/* ── COLLECTION: 브랜드 소개 + 룩 그리드 ──────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-[45%_55%] border-b border-border">

        {/* 좌측 — 브랜드 소개 */}
        <div className="border-r border-border flex flex-col">

          {/* 상단 레이블 바 */}
          <div className="flex justify-between px-6 py-3 border-b border-border">
            <span className="font-inter text-[9px] tracking-[0.4em] uppercase text-secondary">LOOK DISPLAY</span>
            <span className="font-inter text-[9px] tracking-[0.4em] uppercase text-secondary">LOOK DISPLAY</span>
          </div>

          <div className="p-8 md:p-12 flex flex-col flex-1">
            {/* 브랜드명 */}
            <h2
              className="font-playfair font-black text-primary uppercase leading-[0.88] mb-6"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 4rem)' }}
            >
              COORDI<br />ARCHIVE
            </h2>

            {/* 설명 */}
            <p className="font-inter text-sm text-secondary leading-relaxed max-w-xs mb-10">
              일상 속 패션 코디를 에디토리얼 매거진 스타일로<br />
              아카이빙하는 공간입니다. 온도, 계절, 스타일로<br />
              탐색하는 진짜 사람들의 룩을 기록합니다.
            </p>

            {/* 에디토리얼 대형 사진 */}
            <div className="flex-1 relative overflow-hidden mb-6" style={{ minHeight: '320px' }}>
              <img
                src={allPosts[4] ? getCover(allPosts[4]) : 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80'}
                alt="Editorial"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* 네비게이션 링크 */}
            <div className="flex gap-6 mb-4">
              <Link to="/explore" className="font-inter text-xs text-secondary hover:text-primary transition-colors tracking-wider">
                · About
              </Link>
              <Link to="/explore" className="font-inter text-xs text-primary tracking-wider border-b border-primary pb-px hover:text-secondary hover:border-secondary transition-colors">
                look display
              </Link>
            </div>

            <p className="font-inter text-[10px] tracking-[0.2em] text-secondary">
              2026 SS Collection.
            </p>
          </div>
        </div>

        {/* 우측 — 룩 그리드 */}
        <div className="flex flex-col">

          {/* 상단 컬렉션 헤더 */}
          <div className="px-8 md:px-12 py-6 border-b border-border">
            <h3
              className="font-playfair font-bold text-primary"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)', letterSpacing: '0.06em' }}
            >
              【 THE ARCHIVE 】
            </h3>
          </div>

          <div className="p-6 md:p-8 flex-1">
            {isLoading ? (
              <div className="grid grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-x-3 gap-y-6">
                {(gridPosts.length > 0 ? gridPosts : Array(8).fill(null)).map((post, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link to={post ? `/post/${post.id}` : '/explore'} className="group block">
                      {/* 룩 번호 + 서브 */}
                      <p className="font-inter text-[9px] font-semibold tracking-[0.2em] uppercase text-primary mb-0.5">
                        LOOK {String(i + 1).padStart(2, '0')}
                      </p>
                      <p className="font-inter text-[8px] tracking-wider text-secondary mb-1.5">
                        2026 SS Collection
                      </p>
                      {/* 룩 이미지 */}
                      <div className="overflow-hidden aspect-[2/3] bg-gray-50">
                        <img
                          src={post ? getCover(post) : FEATURE_IMG}
                          alt={post?.title || `Look ${i + 1}`}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* VIEW ALL 링크 */}
            <div className="mt-8 text-center border-t border-border pt-6">
              <Link
                to="/explore"
                className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary hover:text-primary transition-colors"
              >
                VIEW ALL LOOKS ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM MARQUEE ─────────────────────────────────────── */}
      <div className="border-t border-border overflow-hidden bg-primary py-3">
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
          className="flex whitespace-nowrap"
        >
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="inline-block font-inter text-[9px] tracking-[0.55em] uppercase text-white/40 px-10"
            >
              COORDI ARCHIVE · FASHION EDITORIAL ·
            </span>
          ))}
        </motion.div>
      </div>

    </main>
  )
}
