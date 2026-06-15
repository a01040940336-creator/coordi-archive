export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  profile_image: string | null
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  title: string
  description: string | null
  editorial_number: number | null
  created_at: string
  updated_at: string
  profiles?: Profile
  post_images?: PostImage[]
  temperature_tags?: TemperatureTag[]
  season_tags?: SeasonTag[]
  style_tags?: StyleTag[]
  item_tags?: ItemTag[]
  likes_count?: number
  comments_count?: number
  bookmarks_count?: number
  is_liked?: boolean
  is_bookmarked?: boolean
}

export interface PostImage {
  id: string
  post_id: string
  image_url: string
  sort_order: number
  created_at: string
}

export interface TemperatureTag {
  id: string
  label: string
  min_temp: number
  max_temp: number
}

export interface SeasonTag {
  id: string
  label: string
  sort_order: number
}

export interface StyleTag {
  id: string
  label: string
}

export interface ItemTag {
  id: string
  label: string
  category: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles?: Profile
}

export interface SearchFilters {
  temperature?: string
  season?: string
  style?: string
  items?: string[]
  query?: string
}

export interface PostWithTags extends Post {
  coordi_post_temperature_tags?: { coordi_temperature_tags: TemperatureTag }[]
  coordi_post_season_tags?: { coordi_season_tags: SeasonTag }[]
  coordi_post_style_tags?: { coordi_post_style_tags: StyleTag }[]
  coordi_post_item_tags?: { coordi_item_tags: ItemTag }[]
}
