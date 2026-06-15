import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInfinitePosts, useTags } from '../hooks/usePosts'
import PostCard from '../components/post/PostCard'
import { SearchFilters } from '../types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedTemp, setSelectedTemp] = useState('')
  const [selectedSeason, setSelectedSeason] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filters, setFilters] = useState<SearchFilters>({})
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data: tags } = useTags()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePosts(filters)
  const allPosts = data?.pages.flat() || []

  const applyFilters = () => {
    setFilters({
      query: query || undefined,
      temperature: selectedTemp || undefined,
      season: selectedSeason || undefined,
      style: selectedStyle || undefined,
      items: selectedItems.length ? selectedItems : undefined,
    })
  }

  useEffect(() => {
    const timer = setTimeout(applyFilters, 400)
    return () => clearTimeout(timer)
  }, [query, selectedTemp, selectedSeason, selectedStyle, selectedItems])

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

  const toggleItem = (label: string) => {
    setSelectedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    )
  }

  const clearAll = () => {
    setQuery('')
    setSelectedTemp('')
    setSelectedSeason('')
    setSelectedStyle('')
    setSelectedItems([])
  }

  const hasFilters = query || selectedTemp || selectedSeason || selectedStyle || selectedItems.length > 0

  const itemsByCategory = tags?.item.reduce((acc: Record<string, string[]>, tag: any) => {
    if (!acc[tag.category]) acc[tag.category] = []
    acc[tag.category].push(tag.label)
    return acc
  }, {}) || {}

  return (
    <main className="pt-14 min-h-screen">
      <section className="px-6 md:px-16 py-16 border-b border-border">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-3">Search</p>
          <h1 className="font-playfair text-5xl md:text-8xl font-bold text-primary leading-none">Archive</h1>

          <div className="mt-8">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search looks, styles…"
              className="w-full md:max-w-lg font-inter text-sm border-b-2 border-primary py-3 pr-4 outline-none bg-transparent placeholder:text-secondary/50 tracking-wide"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col md:flex-row max-w-[1400px] mx-auto">
        {/* Filter sidebar */}
        <aside className="w-full md:w-64 shrink-0 px-6 md:px-16 py-8 border-b md:border-b-0 md:border-r border-border">
          <div className="sticky top-20">
            <div className="flex justify-between items-center mb-8">
              <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary">Filters</p>
              {hasFilters && (
                <button onClick={clearAll} className="font-inter text-[10px] text-secondary hover:text-primary tracking-wider">
                  Clear all
                </button>
              )}
            </div>

            {/* Temperature */}
            <div className="mb-6">
              <p className="font-inter text-[10px] tracking-[0.25em] uppercase text-secondary mb-3">Temperature</p>
              <div className="flex flex-wrap gap-2">
                {tags?.temperature.map((tag: any) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTemp(prev => prev === tag.label ? '' : tag.label)}
                    className={`font-inter text-[10px] tracking-wider px-2 py-1 border transition-colors ${
                      selectedTemp === tag.label
                        ? 'bg-primary text-white border-primary'
                        : 'border-border text-secondary hover:border-primary hover:text-primary'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Season */}
            <div className="mb-6">
              <p className="font-inter text-[10px] tracking-[0.25em] uppercase text-secondary mb-3">Season</p>
              <div className="flex flex-wrap gap-2">
                {tags?.season.map((tag: any) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedSeason(prev => prev === tag.label ? '' : tag.label)}
                    className={`font-inter text-[10px] tracking-wider px-2 py-1 border transition-colors ${
                      selectedSeason === tag.label
                        ? 'bg-primary text-white border-primary'
                        : 'border-border text-secondary hover:border-primary hover:text-primary'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="mb-6">
              <p className="font-inter text-[10px] tracking-[0.25em] uppercase text-secondary mb-3">Style</p>
              <div className="flex flex-wrap gap-2">
                {tags?.style.map((tag: any) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedStyle(prev => prev === tag.label ? '' : tag.label)}
                    className={`font-inter text-[10px] tracking-wider px-2 py-1 border transition-colors ${
                      selectedStyle === tag.label
                        ? 'bg-primary text-white border-primary'
                        : 'border-border text-secondary hover:border-primary hover:text-primary'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Items by category */}
            {Object.entries(itemsByCategory).map(([cat, items]) => (
              <div key={cat} className="mb-6">
                <p className="font-inter text-[10px] tracking-[0.25em] uppercase text-secondary mb-3">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {(items as string[]).map((label: string) => (
                    <button
                      key={label}
                      onClick={() => toggleItem(label)}
                      className={`font-inter text-[10px] tracking-wider px-2 py-1 border transition-colors ${
                        selectedItems.includes(label)
                          ? 'bg-primary text-white border-primary'
                          : 'border-border text-secondary hover:border-primary hover:text-primary'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Active filters display */}
            <AnimatePresence>
              {hasFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-border"
                >
                  <p className="font-inter text-[10px] tracking-[0.25em] uppercase text-secondary mb-2">
                    Active Filters
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {[selectedTemp, selectedSeason, selectedStyle, ...selectedItems].filter(Boolean).map(f => (
                      <span key={f} className="font-inter text-[10px] bg-primary text-white px-2 py-0.5">
                        {f}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 px-6 md:px-16 py-8">
          <div className="mb-6 flex justify-between items-center">
            <p className="font-inter text-xs text-secondary tracking-wider">
              {allPosts.length} results
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : allPosts.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-playfair text-5xl text-gray-200 font-bold">∅</p>
              <p className="font-inter text-sm text-secondary mt-4 tracking-widest uppercase">No results found</p>
              <p className="font-inter text-xs text-secondary/60 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="py-8 text-center">
            {isFetchingNextPage && (
              <p className="font-inter text-xs text-secondary tracking-widest uppercase animate-pulse">Loading…</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
