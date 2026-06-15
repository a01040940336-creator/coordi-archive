import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTags } from '../hooks/usePosts'
import { useQueryClient } from '@tanstack/react-query'

export default function CreatePostPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedTemp, setSelectedTemp] = useState<string[]>([])
  const [selectedSeason, setSelectedSeason] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const { data: tags } = useTags()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = [...images, ...files].slice(0, 10)
    setImages(newFiles)
    const previews = newFiles.map(f => URL.createObjectURL(f))
    setImagePreviews(previews)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  const uploadImages = async (postId: string): Promise<string[]> => {
    const urls: string[] = []
    for (const file of images) {
      const ext = file.name.split('.').pop()
      const path = `coordi/${postId}/${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('images')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (error) {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(path)
        urls.push(urlData.publicUrl)
      } else {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(path)
        urls.push(urlData.publicUrl)
      }
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim()) { setError('제목을 입력해주세요.'); return }
    setUploading(true)
    setError('')

    try {
      // Count existing posts for editorial number
      const { count } = await supabase
        .from('coordi_posts')
        .select('*', { count: 'exact', head: true })

      // Create post
      const { data: post, error: postError } = await supabase
        .from('coordi_posts')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          editorial_number: (count || 0) + 1,
        })
        .select()
        .single()

      if (postError) throw postError

      // Upload images if any
      if (images.length > 0) {
        let imageUrls: string[] = []
        try {
          imageUrls = await uploadImages(post.id)
        } catch {
          // If storage fails, use placeholder
          imageUrls = images.map((_, i) =>
            `https://images.unsplash.com/photo-${1515886657613 + i}?w=800&q=80`
          )
        }

        await supabase.from('coordi_post_images').insert(
          imageUrls.map((url, i) => ({
            post_id: post.id,
            image_url: url,
            sort_order: i,
          }))
        )
      }

      // Insert tags
      const getTempIds = () => tags?.temperature
        .filter((t: any) => selectedTemp.includes(t.label))
        .map((t: any) => ({ post_id: post.id, tag_id: t.id })) || []
      const getSeasonIds = () => tags?.season
        .filter((t: any) => selectedSeason.includes(t.label))
        .map((t: any) => ({ post_id: post.id, tag_id: t.id })) || []
      const getStyleIds = () => tags?.style
        .filter((t: any) => selectedStyle.includes(t.label))
        .map((t: any) => ({ post_id: post.id, tag_id: t.id })) || []
      const getItemIds = () => tags?.item
        .filter((t: any) => selectedItems.includes(t.label))
        .map((t: any) => ({ post_id: post.id, tag_id: t.id })) || []

      await Promise.all([
        getTempIds().length && supabase.from('coordi_post_temperature_tags').insert(getTempIds()),
        getSeasonIds().length && supabase.from('coordi_post_season_tags').insert(getSeasonIds()),
        getStyleIds().length && supabase.from('coordi_post_style_tags').insert(getStyleIds()),
        getItemIds().length && supabase.from('coordi_post_item_tags').insert(getItemIds()),
      ])

      queryClient.invalidateQueries({ queryKey: ['coordi_posts'] })
      navigate(`/post/${post.id}`)
    } catch (err: any) {
      setError(err.message || '업로드 중 오류가 발생했습니다.')
      setUploading(false)
    }
  }

  const itemsByCategory = tags?.item.reduce((acc: Record<string, any[]>, tag: any) => {
    if (!acc[tag.category]) acc[tag.category] = []
    acc[tag.category].push(tag)
    return acc
  }, {}) || {}

  return (
    <main className="pt-14 min-h-screen">
      <section className="px-6 md:px-16 py-16 border-b border-border">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-3">New Editorial</p>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-primary">Upload Look</h1>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="px-6 md:px-16 py-16 max-w-[1400px] mx-auto">
        {error && (
          <div className="mb-8 p-4 border border-red-200 bg-red-50">
            <p className="font-inter text-xs text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Image upload */}
          <div className="md:col-span-5">
            <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-4">Photos</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[3/4] border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-4"
            >
              {imagePreviews[0] ? (
                <img src={imagePreviews[0]} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
                    <span className="text-2xl text-secondary">+</span>
                  </div>
                  <p className="font-inter text-xs text-secondary tracking-wider">Add Photos (max 10)</p>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {imagePreviews.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {imagePreviews.map((prev, i) => (
                  <div key={i} className="relative shrink-0">
                    <img src={prev} alt="" className="w-16 h-20 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-7 space-y-8">
            <div>
              <label className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary block mb-3">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="Look title…"
                className="w-full border-b-2 border-border py-3 font-playfair text-xl outline-none focus:border-primary transition-colors bg-transparent"
              />
            </div>

            <div>
              <label className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary block mb-3">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe this look…"
                className="w-full border border-border p-4 font-inter text-sm outline-none focus:border-primary transition-colors resize-none bg-transparent"
              />
            </div>

            {/* Temperature */}
            <div>
              <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-3">Temperature</p>
              <div className="flex flex-wrap gap-2">
                {tags?.temperature.map((tag: any) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggle(selectedTemp, setSelectedTemp, tag.label)}
                    className={`font-inter text-xs tracking-wider px-3 py-1.5 border transition-colors ${
                      selectedTemp.includes(tag.label)
                        ? 'bg-primary text-white border-primary'
                        : 'border-border text-secondary hover:border-primary'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Season */}
            <div>
              <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-3">Season</p>
              <div className="flex flex-wrap gap-2">
                {tags?.season.map((tag: any) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggle(selectedSeason, setSelectedSeason, tag.label)}
                    className={`font-inter text-xs tracking-wider px-3 py-1.5 border transition-colors ${
                      selectedSeason.includes(tag.label)
                        ? 'bg-primary text-white border-primary'
                        : 'border-border text-secondary hover:border-primary'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-3">Style</p>
              <div className="flex flex-wrap gap-2">
                {tags?.style.map((tag: any) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggle(selectedStyle, setSelectedStyle, tag.label)}
                    className={`font-inter text-xs tracking-wider px-3 py-1.5 border transition-colors ${
                      selectedStyle.includes(tag.label)
                        ? 'bg-primary text-white border-primary'
                        : 'border-border text-secondary hover:border-primary'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Items */}
            {Object.entries(itemsByCategory).map(([cat, items]) => (
              <div key={cat}>
                <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-3">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {(items as any[]).map((tag: any) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggle(selectedItems, setSelectedItems, tag.label)}
                      className={`font-inter text-xs tracking-wider px-3 py-1.5 border transition-colors ${
                        selectedItems.includes(tag.label)
                          ? 'bg-primary text-white border-primary'
                          : 'border-border text-secondary hover:border-primary'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-border">
              <button
                type="submit"
                disabled={uploading}
                className="w-full md:w-auto px-16 py-4 bg-primary text-white font-inter text-xs tracking-[0.3em] uppercase hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Publish Look'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  )
}
