import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useUserBookmarks } from '../hooks/usePosts'
import PostCard from '../components/post/PostCard'

export default function BookmarksPage() {
  const { user, loading } = useAuth()
  if (!loading && !user) return <Navigate to="/login" replace />

  const { data: bookmarks = [], isLoading } = useUserBookmarks(user?.id || '')

  return (
    <main className="pt-14 min-h-screen">
      <section className="px-6 md:px-16 py-16 border-b border-border">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-3">My Archive</p>
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-primary">Saved Looks</h1>
            <p className="font-inter text-xs text-secondary mt-4">{bookmarks.length} looks saved</p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-16 max-w-[1400px] mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[2/3] bg-gray-100 animate-pulse" />)}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-playfair text-6xl text-gray-200 font-bold">∅</p>
            <p className="font-inter text-sm text-secondary mt-4 tracking-widest uppercase">No saved looks</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bookmarks.map((bm: any, i: number) =>
              bm.coordi_posts ? (
                <PostCard key={bm.post_id} post={bm.coordi_posts} index={i} />
              ) : null
            )}
          </div>
        )}
      </section>
    </main>
  )
}
