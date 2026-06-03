export type CourseStatus = 'parked' | 'in_progress' | 'done'
export type CoursePriority = 'low' | 'medium' | 'high'
export type VideoStatus = 'saved' | 'watched'
export type VideoPlatform = 'YouTube' | 'Instagram' | 'Twitter/X' | 'Other'
export type ItemType = 'course' | 'video'

export interface Course {
  id: number
  title: string
  provider: string
  url: string
  category: string
  status: CourseStatus
  notes: string
  date_added: string
  date_started: string | null
  date_completed: string | null
  priority: CoursePriority
  estimated_hours: number | null
}

export interface Video {
  id: number
  title: string
  source_url: string
  platform: VideoPlatform
  category: string
  status: VideoStatus
  notes: string
  date_added: string
  date_watched: string | null
  tags: string
}

export interface Stats {
  total_courses: number
  total_parked: number
  total_in_progress: number
  total_done: number
  total_videos: number
  total_saved: number
  total_watched: number
}
