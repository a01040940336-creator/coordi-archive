import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePost, useToggleLike, useToggleBookmark, useComments, useAddComment, useDeletePost, useUserLikeStatus } from '../hooks/usePosts'
import { useAuth } from '../contexts/AuthContext'

// 아이템 뱃지 위치 (04.jpg 스타일 — 착장 사진 위 A/B/C 오버레이)
const BADGE_POSITIONS = [
  'top-[14%] right-[22%]',
  'top-[40%] left-[10%]',
  'bottom-[30%] right-[16%]',
  'bottom-[12%] left-[22%]',
  'top-[62%] right-[28%]',
  'top-[22%] left-[8%]',
]

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [commentText, setCommentText] = useState('')

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
  const allTags = [...tempTags, ...seasonTags, ...styleTags]

  const likesCount = post.coordi_likes?.[0]?.count || 0
  const commentsCount = post.coordi_comments?.[0]?.count || 0

  return (
    <main className="pt-14 min-h-screen bg-white">

      {/* ── HERO: 01.jpg 스타일 에디토리얼 레이아웃 ──────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* 배경 에디토리얼 번호 (01.jpg 'CLOSE UP' 텍스처 참고) */}
        <div className="absolute inset-0 flex items-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="font-playfair font-bold leading-none text-black/[0.035]"
            style={{ fontSize: 'clamp(120px, 24vw, 380px)' }}>
            {editorialNum}
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_56%] min-h-[88vh]">

          {/* 왼쪽 — 타이틀 블록 */}
          <div className="flex flex-col justify-between p-8 md:p-14 py-14">
            <p className="font-inter text-[9px] tracking-[0.55em] uppercase text-secondary">
              Coordi Archive — No.{editorialNum}
            </p>

            <div>
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-playfair font-bold text-primary leading-[0.88] mb-8"
                style={{ fontSize: 'clamp(42px, 6vw, 90px)' }}
              >
                {post.title}
              </motion.h1>

              {post.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="font-inter text-sm text-secondary leading-relaxed max-w-xs tracking-wide mb-10"
                >
                  {post.description}
                </motion.p>
              )}

              {/* 액션 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-2.5 border font-inter text-[10px] tracking-widest uppercase transition-colors ${
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
                  className={`flex items-center gap-2 px-5 py-2.5 border font-inter text-[10px] tracking-widest uppercase transition-colors ${
                    likeStatus?.isBookmarked
                      ? 'bg-primary text-white border-primary'
                      : 'border-border text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  <span>{likeStatus?.isBookmarked ? '■' : '□'}</span>
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* 하단 — 작성자 + 태그 */}
            <div className="border-t border-border pt-6">
              {post.coordi_profiles && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 bg-gray-100 rounded-full overflow-hidden shrink-0">
                    {post.coordi_profiles.profile_image && (
                      <img src={post.coordi_profiles.profile_image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <Link
                    to={`/profile/${post.coordi_profiles.username}`}
                    className="font-inter text-xs text-secondary hover:text-primary transition-colors"
                  >
                    {post.coordi_profiles.display_name || post.coordi_profiles.username}
                  </Link>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag: string) => (
                  <span key={tag} className="font-inter text-[9px] tracking-widest uppercase border border-border px-2.5 py-1 text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 — 메인 착장 사진 */}
          <div className="relative h-[70vh] md:h-auto overflow-hidden">
            {images[0] ? (
              <motion.img
                initial={{ scale: 1.06, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                src={images[0].image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <span className="font-playfair text-8xl text-gray-200 font-bold select-none">{editorialNum}</span>
              </div>
            )}
            <div className="absolute bottom-5 right-5">
              <p className="font-inter text-[9px] tracking-[0.3em] uppercase text-white/50 select-none">
                {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ITEM BREAKDOWN: 04.jpg 스타일 ─────────────────────────────── */}
      {itemTags.length > 0 && (
        <section className="px-8 md:px-14 py-20 border-b border-border">
          <div className="max-w-[1400px] mx-auto">

            {/* 섹션 헤더 */}
            <div className="flex items-center gap-3 mb-16">
              <p className="font-inter text-[9px] tracking-[0.5em] uppercase text-secondary">
                No.{editorialNum}
              </p>
              <span className="text-border">—</span>
              <p className="font-inter text-[9px] tracking-[0.3em] uppercase text-secondary">
                "{post.title}"
              </p>
              <div className="flex gap-1.5 ml-3">
                <span className="text-gray-300 text-base select-none">✦</span>
                <span className="text-gray-300 text-base select-none">✦</span>
                <span className="text-gray-200 text-base select-none">✦</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[44%_1fr] gap-12 md:gap-20 items-start">

              {/* 왼쪽: A, B, C 아이템 카드 목록 */}
              <div className="space-y-10">
                {itemTags.map((tag: any, i: number) => {
                  const letter = String.fromCharCode(65 + i)
                  const productImg = images[i + 1]
                  return (
                    <motion.div
                      key={tag.id}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex gap-5 items-center"
                    >
                      {/* 알파벳 레이블 */}
                      <span className="font-inter text-5xl font-bold text-black/10 shrink-0 w-10 text-center leading-none select-none">
                        {letter}
                      </span>

                      {/* 제품 이미지 (04.jpg: 컷아웃/플랫레이 영역) */}
                      <div className="w-28 h-36 bg-gray-50 border border-border/60 overflow-hidden shrink-0 flex items-center justify-center">
                        {productImg ? (
                          <img
                            src={productImg.image_url}
                            alt={tag.label}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-playfair text-3xl text-gray-200 font-bold select-none">{letter}</span>
                        )}
                      </div>

                      {/* 아이템 정보 */}
                      <div>
                        <p className="font-inter text-[9px] tracking-[0.45em] uppercase text-secondary mb-1.5">
                          {tag.category}
                        </p>
                        <p className="font-inter text-sm font-medium text-primary tracking-wide leading-snug">
                          {tag.label}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* 오른쪽: 착장 사진 + A/B/C 뱃지 오버레이 */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="relative"
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  {images[0] ? (
                    <img
                      src={images[0].image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <span className="font-playfair text-6xl text-gray-200 font-bold select-none">{editorialNum}</span>
                    </div>
                  )}
                  {/* 알파벳 뱃지 */}
                  {itemTags.slice(0, 6).map((_: any, i: number) => (
                    <div
                      key={i}
                      className={`absolute ${BADGE_POSITIONS[i]} w-7 h-7 bg-white rounded-full flex items-center justify-center shadow border border-black/8`}
                    >
                      <span className="font-inter text-[10px] font-bold text-primary select-none">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ── 추가 이미지 스트립 (아이템 태그 없을 때만) ──────────────────── */}
      {images.length > 1 && itemTags.length === 0 && (
        <section className="px-8 md:px-14 py-10 border-b border-border">
          <div className="max-w-[1400px] mx-auto flex gap-3 overflow-x-auto pb-2">
            {images.map((img: any) => (
              <div key={img.id} className="shrink-0 w-24 h-32 overflow-hidden border border-border/50">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 댓글 + 사이드바 ──────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-16">

          {/* 댓글 */}
          <div>
            <h2 className="font-playfair text-3xl font-bold mb-10">
              Comments
              <span className="font-inter text-base font-normal text-secondary ml-3">({commentsCount})</span>
            </h2>

            {user ? (
              <form onSubmit={handleComment} className="mb-12">
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
                    className="font-inter text-[10px] tracking-widest uppercase px-8 py-3 bg-primary text-white hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-12 py-6 border border-dashed border-border text-center">
                <p className="font-inter text-xs text-secondary tracking-wide">
                  <Link to="/login" className="text-primary hover:text-secondary underline underline-offset-4">
                    Log in
                  </Link>{' '}
                  to leave a comment
                </p>
              </div>
            )}

            <div className="space-y-8">
              {comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-4 border-b border-border pb-8 last:border-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full shrink-0 overflow-hidden">
                    {comment.coordi_profiles?.profile_image && (
                      <img src={comment.coordi_profiles.profile_image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1.5">
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
                    <p className="font-inter text-sm text-secondary leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 사이드바 */}
          <aside>
            <div className="sticky top-24 space-y-5">

              {/* 스타일리스트 카드 */}
              {post.coordi_profiles && (
                <div className="border border-border p-6">
                  <p className="font-inter text-[9px] tracking-[0.45em] uppercase text-secondary mb-4">Stylist</p>
                  <Link to={`/profile/${post.coordi_profiles.username}`} className="flex items-center gap-3 group">
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

              {/* 아카이브 날짜 */}
              <div className="border border-border p-6">
                <p className="font-inter text-[9px] tracking-[0.45em] uppercase text-secondary mb-2">Archived</p>
                <p className="font-inter text-sm text-primary">
                  {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* 편집 / 삭제 */}
              {user && user.id === post.user_id && (
                <div className="flex flex-col gap-2">
                  <Link
                    to={`/edit/${post.id}`}
                    className="font-inter text-[10px] tracking-widest uppercase text-center py-3 border border-border text-secondary hover:border-primary hover:text-primary transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="font-inter text-[10px] tracking-widest uppercase py-3 border border-border text-secondary hover:border-red-500 hover:text-red-500 transition-colors"
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
