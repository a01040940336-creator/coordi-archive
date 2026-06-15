import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInfinitePosts } from '../hooks/usePosts'
import PostCard from '../components/post/PostCard'
import { SearchFilters } from '../types'

export default function ExplorePage() {
  const filters: SearchFilters = {}
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePosts(filters)
  const allPosts = data?.pages.flat() || []

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [handleObserver])

  return (
    <main className="pt-14 min-h-screen">
      {/* Header */}
      <section className="px-6 md:px-16 py-16 border-b border-border">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-3">
              The Archive
            </p>
            <h1 className="font-playfair text-5xl md:text-8xl font-bold text-primary leading-none">
              Explore
            </h1>
            <p className="font-inter text-sm text-secondary mt-4 tracking-wide">
              {allPosts.length} looks archived
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-16 py-16 max-w-[1400px] mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : allPosts.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-playfair text-6xl text-gray-200 font-bold">000</p>
            <p className="font-inter text-sm text-secondary mt-4 tracking-widest uppercase">No looks yet</p>
          </div>
        ) : (
          <>
            {/* First row — asymmetric */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              {allPosts[0] && (
                <div className="md:col-span-5">
                  <PostCard post={allPosts[0]} index={0} variant="large" />
                </div>
              )}
              {allPosts[1] && (
                <div className="md:col-span-4 md:mt-16">
                  <PostCard post={allPosts[1]} index={1} variant="large" />
                </div>
              )}
              {allPosts[2] && (
                <div className="md:col-span-3">
                  <PostCard post={allPosts[2]} index={2} variant="large" />
                </div>
              )}
            </div>

            {/* Regular grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {allPosts.slice(3).map((post, i) => (
                <PostCard key={post.id} post={post} index={i + 3} />
              ))}
            </div>
          </>
        )}

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="py-8 text-center">
          {isFetchingNextPage && (
            <p className="font-inter text-xs text-secondary tracking-widest uppercase animate-pulse">
              Loading more…
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
