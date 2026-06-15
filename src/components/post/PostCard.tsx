import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface PostCardProps {
  post: any
  index?: number
  variant?: 'default' | 'large' | 'minimal'
}

export default function PostCard({ post, index = 0, variant = 'default' }: PostCardProps) {
  const coverImage = post.coordi_post_images
    ?.sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url

  const tempTag = post.coordi_post_temperature_tags?.[0]?.coordi_temperature_tags?.label
  const seasonTag = post.coordi_post_season_tags?.[0]?.coordi_season_tags?.label
  const styleTag = post.coordi_post_style_tags?.[0]?.coordi_style_tags?.label
  const editorialNum = post.editorial_number
    ? String(post.editorial_number).padStart(3, '0')
    : String(index + 1).padStart(3, '0')

  if (variant === 'large') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <Link to={`/post/${post.id}`} className="group block">
          <div className="relative overflow-hidden aspect-[3/4]">
            {coverImage ? (
              <img
                src={coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="font-playfair text-4xl text-gray-300">{editorialNum}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <p className="font-inter text-white text-xs tracking-widest uppercase mb-1">
                {[tempTag, seasonTag].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-1">
                  No.{editorialNum}
                </p>
                <h3 className="font-playfair text-xl font-medium text-primary leading-tight">
                  {post.title}
                </h3>
              </div>
              {styleTag && (
                <span className="font-inter text-[10px] tracking-wider uppercase text-secondary border border-border px-2 py-1 shrink-0 mt-1">
                  {styleTag}
                </span>
              )}
            </div>
            {post.coordi_profiles && (
              <p className="font-inter text-xs text-secondary mt-2">
                by {post.coordi_profiles.display_name || post.coordi_profiles.username}
              </p>
            )}
          </div>
        </Link>
      </motion.div>
    )
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Link to={`/post/${post.id}`} className="group flex gap-4 items-start py-4 border-b border-border">
          <div className="relative overflow-hidden w-16 h-20 shrink-0">
            {coverImage ? (
              <img src={coverImage} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100" />
            )}
          </div>
          <div>
            <p className="font-inter text-[10px] tracking-widest uppercase text-secondary">No.{editorialNum}</p>
            <h3 className="font-playfair text-base font-medium text-primary mt-1 group-hover:text-secondary transition-colors">
              {post.title}
            </h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              {tempTag && <span className="font-inter text-[10px] text-secondary">{tempTag}</span>}
              {seasonTag && <span className="font-inter text-[10px] text-secondary">· {seasonTag}</span>}
              {styleTag && <span className="font-inter text-[10px] text-secondary">· {styleTag}</span>}
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/post/${post.id}`} className="group block">
        <div className="relative overflow-hidden aspect-[2/3]">
          {coverImage ? (
            <img
              src={coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
              <span className="font-playfair text-5xl text-gray-200 font-bold">{editorialNum}</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="font-inter text-[10px] tracking-[0.25em] uppercase text-secondary">
            No.{editorialNum} {tempTag && `· ${tempTag}`}
          </p>
          <h3 className="font-playfair text-lg font-medium text-primary mt-1 leading-tight group-hover:text-secondary transition-colors">
            {post.title}
          </h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            {seasonTag && (
              <span className="font-inter text-[10px] text-secondary border border-border px-2 py-0.5">
                {seasonTag}
              </span>
            )}
            {styleTag && (
              <span className="font-inter text-[10px] text-secondary border border-border px-2 py-0.5">
                {styleTag}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
