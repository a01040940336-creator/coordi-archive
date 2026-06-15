import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePost, useToggleLike, useToggleBookmark, useComments, useAddComment, useDeletePost, useUserLikeStatus } from '../hooks/usePosts'
import { useAuth } from '../contexts/AuthContext'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [commentText, setCommentText] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const { data: post, isLoading } = usePost(id!)
  const { data: comments = [] } = useComments(id!)
  const { data: likeStatus } = useUserLikeStatus(id!, user?.id)

  const toggleLike = useToggleLike()
  const toggleBookmark = useToggleBookmark()
  const addComment = useAddComment()
  const deletePost = useDeletePost()

  const handleLike = () => {
    if (!user || !post) return
    toggleLike.mutate({ postId: post.id, userId: user.id, isLiked: !!likeStatus?.isLiked })
  }

  const handleBookmark = () => {
    if (!user || !post) return
    toggleBookmark.mutate({ postId: post.id, userId: user.id, isBookmarked: !!likeStatus?.isBookmarked })
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !post || !commentText.trim()) return
    addComment.mutate({ postId: post.id, userId: user.id, content: commentText.trim() })
    setCommentText('')
  }

  const handleDelete = async () => {
    if (!post || !confirm('이 게시물을 삭제하시겠습니까?')) return
    deletePost.mutate(post.id)
    navigate('/explore')
  }

  if (isLoading) {
    return (
      <div className="pt-14 min-h-screen flex items-center justify-center">
        <div className="font-playfair text-6xl text-gray-200 animate-pulse">···</div>
      </div>
    )
  }

  if (!post) return (
    <div className="pt-14 min-h-screen flex items-center justify-center">
      <p className="font-inter text-sm text-secondary">Post not found.</p>
    </div>
  )

  const images = [...(post.coordi_post_images || [])].sort((a: any, b: any) => a.sort_order - b.sort_order)
  const editorialNum = post.editorial_number
    ? String(post.editorial_number).padStart(3, '0')
    : '001'

  const tempTags = post.coordi_post_temperature_tags?.map((t: any) => t.coordi_temperature_tags?.label).filter(Boolean) || []
  const seasonTags = post.coordi_post_season_tags?.map((t: any) => t.coordi_season_tags?.label).filter(Boolean) || []
  const styleTags = post.coordi_post_style_tags?.map((t: any) => t.coordi_style_tags?.label).filter(Boolean) || []
  const itemTags = post.coordi_post_item_tags?.map((t: any) => t.coordi_item_tags).filter(Boolean) || []
  const itemsByCategory = itemTags.reduce((acc: Record<string, string[]>, tag: any) => {
    if (!acc[tag.category]) acc[tag.category] = []
    acc[tag.category].push(tag.label)
    return acc
  }, {})

  const likesCount = post.coordi_likes?.[0]?.count || 0
  const commentsCount = post.coordi_comments?.[0]?.count || 0

  return (
    <main className="pt-14 min-h-screen">
      {/* Hero image — full width */}
      <section className="relative">
        {images[activeImageIndex] ? (
          <motion.div
            key={activeImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-[70vh] md:h-screen max-h-[900px]"
          >
            <img
              src={images[activeImageIndex].image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="w-full h-[60vh] bg-gray-100 flex items-center justify-center">
            <span className="font-playfair text-8xl text-gray-300 font-bold">{editorialNum}</span>
          </div>
        )}

        {/* Editorial number overlay */}
        <div className="absolute top-8 left-8">
          <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-white/60">
            Editorial No.{editorialNum}
          </p>
        </div>

        {/* Image thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`w-1 h-6 transition-colors ${i === activeImageIndex ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Multiple image strip */}
      {images.length > 1 && (
        <section className="px-6 md:px-16 py-4 max-w-[1400px] mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((img: any, i: number) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(i)}
                className={`shrink-0 w-20 h-24 overflow-hidden border-2 transition-colors ${
                  i === activeImageIndex ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Content — editorial layout */}
      <section className="px-6 md:px-16 py-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Main content */}
          <div className="md:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">
                Editorial No.{editorialNum}
              </p>
              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-primary leading-tight mb-8">
                {post.title}
              </h1>
              {post.description && (
                <p className="font-inter text-base text-secondary leading-relaxed tracking-wide mb-12 max-w-lg">
                  {post.description}
                </p>
              )}

              {/* Tag sections */}
              <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
                {tempTags.length > 0 && (
                  <div>
                    <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-3">Temperature</p>
                    <div className="flex flex-wrap gap-2">
                      {tempTags.map((tag: string) => (
                        <span key={tag} className="font-inter text-sm text-primary font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                {seasonTags.length > 0 && (
                  <div>
                    <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-3">Season</p>
                    <div className="flex flex-wrap gap-2">
                      {seasonTags.map((tag: string) => (
                        <span key={tag} className="font-inter text-sm text-primary font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                {styleTags.length > 0 && (
                  <div>
                    <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-3">Style</p>
                    <div className="flex flex-wrap gap-2">
                      {styleTags.map((tag: string) => (
                        <span key={tag} className="font-inter text-sm text-primary font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                {Object.keys(itemsByCategory).length > 0 && (
                  <div>
                    <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-3">Items</p>
                    {Object.entries(itemsByCategory).map(([cat, items]) => (
                      <div key={cat} className="mb-2">
                        <span className="font-inter text-[10px] text-secondary mr-2">{cat}</span>
                        {(items as string[]).map((item: string) => (
                          <span key={item} className="font-inter text-sm text-primary font-medium mr-2">{item}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Comments */}
            <div className="mt-16 border-t border-border pt-12">
              <h2 className="font-playfair text-2xl font-bold mb-8">
                Comments <span className="font-inter text-lg font-normal text-secondary">({commentsCount})</span>
              </h2>

              {user && (
                <form onSubmit={handleComment} className="mb-10">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Leave a comment…"
                    rows={3}
                    className="w-full border border-border p-4 font-inter text-sm outline-none focus:border-primary transition-colors resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={addComment.isPending}
                      className="font-inter text-xs tracking-widest uppercase px-8 py-3 bg-primary text-white hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                      Post
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-6">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full shrink-0 overflow-hidden">
                      {comment.coordi_profiles?.profile_image && (
                        <img src={comment.coordi_profiles.profile_image} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="flex gap-3 items-baseline mb-1">
                        <Link
                          to={`/profile/${comment.coordi_profiles?.username}`}
                          className="font-inter text-xs font-medium text-primary hover:text-secondary tracking-wider"
                        >
                          {comment.coordi_profiles?.display_name || comment.coordi_profiles?.username}
                        </Link>
                        <span className="font-inter text-[10px] text-secondary">
                          {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <p className="font-inter text-sm text-primary leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="sticky top-24">
              {/* Author */}
              {post.coordi_profiles && (
                <div className="border border-border p-6 mb-6">
                  <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-4">Stylist</p>
                  <Link
                    to={`/profile/${post.coordi_profiles.username}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden shrink-0">
                      {post.coordi_profiles.profile_image && (
                        <img src={post.coordi_profiles.profile_image} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-inter text-sm font-medium text-primary group-hover:text-secondary transition-colors">
                        {post.coordi_profiles.display_name || post.coordi_profiles.username}
                      </p>
                      <p className="font-inter text-[10px] text-secondary">@{post.coordi_profiles.username}</p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={handleLike}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border transition-colors font-inter text-xs tracking-wider ${
                    likeStatus?.isLiked
                      ? 'bg-primary text-white border-primary'
                      : 'border-border text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  <span>{likeStatus?.isLiked ? '♥' : '♡'}</span>
                  <span>{likesCount}</span>
                </button>
                <button
                  onClick={handleBookmark}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border transition-colors font-inter text-xs tracking-wider ${
                    likeStatus?.isBookmarked
                      ? 'bg-primary text-white border-primary'
                      : 'border-border text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  <span>{likeStatus?.isBookmarked ? '■' : '□'}</span>
                  <span>Save</span>
                </button>
              </div>

              {/* Date */}
              <div className="border-t border-border pt-6">
                <p className="font-inter text-[10px] text-secondary tracking-wider">
                  Archived {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Owner actions */}
              {user && user.id === post.user_id && (
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to={`/edit/${post.id}`}
                    className="font-inter text-xs tracking-widest uppercase text-center py-2 border border-border text-secondary hover:border-primary hover:text-primary transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="font-inter text-xs tracking-widest uppercase py-2 border border-border text-secondary hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
