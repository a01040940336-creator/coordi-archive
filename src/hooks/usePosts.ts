import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { SearchFilters } from '../types'

const PAGE_SIZE = 12

async function fetchPosts(page: number, filters?: SearchFilters) {
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('coordi_posts')
    .select(`
      *,
      coordi_profiles(id, username, display_name, profile_image),
      coordi_post_images(id, image_url, sort_order),
      coordi_post_temperature_tags(tag_id, coordi_temperature_tags(id, label)),
      coordi_post_season_tags(tag_id, coordi_season_tags(id, label)),
      coordi_post_style_tags(tag_id, coordi_style_tags(id, label)),
      coordi_post_item_tags(tag_id, coordi_item_tags(id, label, category)),
      coordi_likes(count),
      coordi_comments(count)
    `)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (filters?.query) {
    query = query.ilike('title', `%${filters.query}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

async function fetchPostById(id: string) {
  const { data, error } = await supabase
    .from('coordi_posts')
    .select(`
      *,
      coordi_profiles(id, username, display_name, profile_image, bio),
      coordi_post_images(id, image_url, sort_order),
      coordi_post_temperature_tags(tag_id, coordi_temperature_tags(id, label)),
      coordi_post_season_tags(tag_id, coordi_season_tags(id, label)),
      coordi_post_style_tags(tag_id, coordi_style_tags(id, label)),
      coordi_post_item_tags(tag_id, coordi_item_tags(id, label, category)),
      coordi_likes(count),
      coordi_comments(count)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export function useInfinitePosts(filters?: SearchFilters) {
  return useInfiniteQuery({
    queryKey: ['coordi_posts', filters],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam as number, filters),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
    initialPageParam: 0,
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['coordi_post', id],
    queryFn: () => fetchPostById(id),
    enabled: !!id,
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from('coordi_posts').delete().eq('id', postId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coordi_posts'] }),
  })
}

export function useToggleLike() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ postId, userId, isLiked }: { postId: string; userId: string; isLiked: boolean }) => {
      if (isLiked) {
        await supabase.from('coordi_likes').delete().eq('post_id', postId).eq('user_id', userId)
      } else {
        await supabase.from('coordi_likes').insert({ post_id: postId, user_id: userId })
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coordi_post', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['coordi_posts'] })
    },
  })
}

export function useToggleBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ postId, userId, isBookmarked }: { postId: string; userId: string; isBookmarked: boolean }) => {
      if (isBookmarked) {
        await supabase.from('coordi_bookmarks').delete().eq('post_id', postId).eq('user_id', userId)
      } else {
        await supabase.from('coordi_bookmarks').insert({ post_id: postId, user_id: userId })
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coordi_post', variables.postId] })
    },
  })
}

export function useTags() {
  return useQuery({
    queryKey: ['coordi_tags'],
    queryFn: async () => {
      const [temp, season, style, item] = await Promise.all([
        supabase.from('coordi_temperature_tags').select('*').order('min_temp'),
        supabase.from('coordi_season_tags').select('*').order('sort_order'),
        supabase.from('coordi_style_tags').select('*'),
        supabase.from('coordi_item_tags').select('*').order('category'),
      ])
      return {
        temperature: temp.data || [],
        season: season.data || [],
        style: style.data || [],
        item: item.data || [],
      }
    },
    staleTime: Infinity,
  })
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['coordi_comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coordi_comments')
        .select('*, coordi_profiles(id, username, display_name, profile_image)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data || []
    },
    enabled: !!postId,
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ postId, userId, content }: { postId: string; userId: string; content: string }) => {
      const { error } = await supabase
        .from('coordi_comments')
        .insert({ post_id: postId, user_id: userId, content })
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coordi_comments', variables.postId] })
    },
  })
}

export function useUserBookmarks(userId: string) {
  return useQuery({
    queryKey: ['coordi_bookmarks', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coordi_bookmarks')
        .select('post_id, coordi_posts(*, coordi_post_images(image_url, sort_order))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

export function useUserPosts(userId: string) {
  return useQuery({
    queryKey: ['coordi_user_posts', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coordi_posts')
        .select('*, coordi_post_images(image_url, sort_order)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

export function useUserLikeStatus(postId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['coordi_like_status', postId, userId],
    queryFn: async () => {
      if (!userId) return { isLiked: false, isBookmarked: false }
      const [likeRes, bookmarkRes] = await Promise.all([
        supabase.from('coordi_likes').select('id').eq('post_id', postId).eq('user_id', userId).maybeSingle(),
        supabase.from('coordi_bookmarks').select('id').eq('post_id', postId).eq('user_id', userId).maybeSingle(),
      ])
      return { isLiked: !!likeRes.data, isBookmarked: !!bookmarkRes.data }
    },
    enabled: !!postId,
  })
}
