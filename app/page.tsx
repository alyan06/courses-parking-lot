'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, ArrowRight, BookOpen, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatsBar } from '@/components/StatsBar'
import { AddEditModal } from '@/components/AddEditModal'
import { StatusBadge } from '@/components/StatusBadge'
import { PriorityBadge } from '@/components/StatusBadge'
import { timeAgo } from '@/lib/utils'
import type { Stats, Course, Video as VideoType, ItemType } from '@/lib/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentCourses, setRecentCourses] = useState<Course[]>([])
  const [recentVideos, setRecentVideos] = useState<VideoType[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultType, setDefaultType] = useState<ItemType>('course')

  const fetchData = useCallback(async () => {
    const [statsRes, coursesRes, videosRes] = await Promise.all([
      fetch('/api/stats'),
      fetch('/api/courses?sort=date_added&order=desc'),
      fetch('/api/videos?sort=date_added&order=desc'),
    ])
    const [statsData, coursesData, videosData] = await Promise.all([
      statsRes.json(),
      coursesRes.json(),
      videosRes.json(),
    ])
    setStats(statsData)
    setRecentCourses(Array.isArray(coursesData) ? coursesData.slice(0, 5) : [])
    setRecentVideos(Array.isArray(videosData) ? videosData.slice(0, 5) : [])
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Global "N" key shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        const tag = (e.target as HTMLElement).tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault()
          setDefaultType('course')
          setModalOpen(true)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const openModal = (type: ItemType) => {
    setDefaultType(type)
    setModalOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-slate-100">
            Command Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Everything you&apos;ve saved, at a glance.
          </p>
        </div>
        <Button
          onClick={() => openModal('course')}
          className="bg-blue-600 hover:bg-blue-700 font-mono shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Item
          <kbd className="ml-2 rounded border border-blue-500 bg-blue-700/50 px-1 py-0.5 text-[10px] opacity-70 hidden sm:inline">
            N
          </kbd>
        </Button>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Quick add row */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => openModal('course')}
          className="flex items-center gap-3 rounded-lg border border-dashed border-[#2a3042] bg-[#1a1f2e]/50 p-4 text-left hover:border-blue-800 hover:bg-[#1a2040]/60 transition-all group"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-800/50 group-hover:bg-blue-600/30 transition-colors">
            <BookOpen className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="font-mono text-sm font-semibold text-slate-200">+ Course / Cert</p>
            <p className="text-xs text-slate-600">Park a new course</p>
          </div>
        </button>
        <button
          onClick={() => openModal('video')}
          className="flex items-center gap-3 rounded-lg border border-dashed border-[#2a3042] bg-[#1a1f2e]/50 p-4 text-left hover:border-purple-800 hover:bg-[#1a1a30]/60 transition-all group"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 border border-purple-800/50 group-hover:bg-purple-600/30 transition-colors">
            <Video className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <p className="font-mono text-sm font-semibold text-slate-200">+ Video / Resource</p>
            <p className="text-xs text-slate-600">Save something you found</p>
          </div>
        </button>
      </div>

      {/* Recent sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Courses */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-mono text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Recent Courses
            </h2>
            <Link
              href="/courses"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-mono"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentCourses.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#2a3042] py-8 text-center">
                <p className="text-sm text-slate-600 font-mono">No courses yet.</p>
              </div>
            ) : (
              recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-3 rounded-lg border border-[#2a3042] bg-[#1a1f2e] px-3 py-2.5 hover:bg-[#1f2638] transition-colors"
                >
                  <StatusBadge status={course.status} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-medium text-slate-100 truncate">
                      {course.title}
                    </p>
                    <p className="text-[11px] text-slate-600 truncate">
                      {[course.provider, course.category].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <PriorityBadge priority={course.priority} />
                    <span className="text-[11px] text-slate-600 font-mono hidden sm:block">
                      {timeAgo(course.date_added)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Videos */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-mono text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Recent Videos
            </h2>
            <Link
              href="/videos"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-mono"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentVideos.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#2a3042] py-8 text-center">
                <p className="text-sm text-slate-600 font-mono">No videos saved yet.</p>
              </div>
            ) : (
              recentVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-3 rounded-lg border border-[#2a3042] bg-[#1a1f2e] px-3 py-2.5 hover:bg-[#1f2638] transition-colors"
                >
                  <StatusBadge status={video.status} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-medium text-slate-100 truncate">
                      {video.title}
                    </p>
                    <p className="text-[11px] text-slate-600 truncate">
                      {video.platform}
                      {video.category && ` · ${video.category}`}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {video.source_url && (
                      <a
                        href={video.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-500 hover:text-blue-400 font-mono transition-colors"
                      >
                        Open ↗
                      </a>
                    )}
                    <span className="text-[11px] text-slate-600 font-mono hidden sm:block">
                      {timeAgo(video.date_added)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <AddEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        defaultType={defaultType}
      />
    </div>
  )
}
