import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useUserPosts, useUserBookmarks } from '../hooks/usePosts'
import { useAuth } from '../contexts/AuthContext'
import PostCard from '../components/post/PostCard'

type Tab = 'posts' | 'bookmarks'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { user, profile: myProfile, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('posts')
  const [editMode, setEditMode] = useState(false)
  const [editBio, setEditBio] = useState('')
  const [editDisplay, setEditDisplay] = useState('')

  const { data: profileData } = useQuery({
    queryKey: ['coordi_profile', username],
    queryFn: async () => {
      const { data } = await supabase
        .from('coordi_profiles')
        .select('*')
        .eq('username', username)
        .single()
      return data
    },
    enabled: !!username,
  })

  const profile = profileData
  const isOwner = user && myProfile?.username === username

  const { data: posts = [] } = useUserPosts(profile?.id || '')
  const { data: bookmarks = [] } = useUserBookmarks(isOwner ? user!.id : '')

  const startEdit = () => {
    setEditBio(myProfile?.bio || '')
    setEditDisplay(myProfile?.display_name || '')
    setEditMode(true)
  }

  const saveEdit = async () => {
    await updateProfile({ bio: editBio, display_name: editDisplay })
    setEditMode(false)
  }

  if (!profile) {
    return (
      <div className="pt-14 min-h-screen flex items-center justify-center">
        <p className="font-inter text-sm text-secondary">Profile not found.</p>
      </div>
    )
  }

  return (
    <main className="pt-14 min-h-screen">
      {/* Profile header */}
      <section className="px-6 md:px-16 py-16 border-b border-border">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-2">
              <div className="w-24 h-24 md:w-full md:aspect-square bg-gray-100 overflow-hidden">
                {profile.profile_image ? (
                  <img src={profile.profile_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-playfair text-4xl text-gray-300">
                      {(profile.display_name || profile.username)?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-1">
                  @{profile.username}
                </p>
                {editMode ? (
                  <input
                    value={editDisplay}
                    onChange={e => setEditDisplay(e.target.value)}
                    className="font-playfair text-4xl font-bold text-primary border-b-2 border-primary outline-none bg-transparent mb-4 w-full"
                  />
                ) : (
                  <h1 className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-4">
                    {profile.display_name || profile.username}
                  </h1>
                )}

                {editMode ? (
                  <textarea
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    rows={3}
                    placeholder="Bio…"
                    className="w-full border border-border p-3 font-inter text-sm outline-none focus:border-primary resize-none"
                  />
                ) : profile.bio ? (
                  <p className="font-inter text-sm text-secondary leading-relaxed max-w-md">{profile.bio}</p>
                ) : null}

                <div className="flex gap-6 mt-6">
                  <div>
                    <p className="font-playfair text-2xl font-bold text-primary">{posts.length}</p>
                    <p className="font-inter text-[10px] tracking-widest uppercase text-secondary">Looks</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {isOwner && (
              <div className="md:col-span-3 flex justify-end gap-2">
                {editMode ? (
                  <>
                    <button onClick={saveEdit} className="font-inter text-xs tracking-wider uppercase px-6 py-2 bg-primary text-white">
                      Save
                    </button>
                    <button onClick={() => setEditMode(false)} className="font-inter text-xs tracking-wider uppercase px-6 py-2 border border-border text-secondary">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={startEdit} className="font-inter text-xs tracking-wider uppercase px-6 py-2 border border-border text-secondary hover:border-primary hover:text-primary transition-colors">
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-6 md:px-16 py-4 border-b border-border sticky top-14 bg-white z-10">
        <div className="max-w-[1400px] mx-auto flex gap-8">
          {(['posts', ...(isOwner ? ['bookmarks'] : [])] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-inter text-xs tracking-[0.3em] uppercase py-3 border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              {tab === 'posts' ? `Looks (${posts.length})` : 'Saved'}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-16 py-12 max-w-[1400px] mx-auto">
        {activeTab === 'posts' ? (
          posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-playfair text-5xl text-gray-200 font-bold">∅</p>
              <p className="font-inter text-sm text-secondary mt-4">No looks yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {posts.map((post: any, i: number) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )
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
