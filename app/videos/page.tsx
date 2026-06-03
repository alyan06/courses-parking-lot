'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, LayoutGrid, Table2, ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AddEditModal } from '@/components/AddEditModal'
import { VideoTable } from '@/components/VideoTable'
import { EmptyState } from '@/components/EmptyState'
import type { Video } from '@/lib/types'

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editVideo, setEditVideo] = useState<Video | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date_added')
  const [sortOrder, setSortOrder] = useState('desc')

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (platformFilter !== 'all') params.set('platform', platformFilter)
      params.set('sort', sortBy)
      params.set('order', sortOrder)
      const res = await fetch(`/api/videos?${params}`)
      const data = await res.json()
      setVideos(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, platformFilter, sortBy, sortOrder])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // "N" key shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        const tag = (e.target as HTMLElement).tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault()
          setEditVideo(null)
          setModalOpen(true)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this resource? This cannot be undone.')) return
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' })
      toast.success('Resource removed')
      fetchVideos()
    } catch {
      toast.error('Failed to delete resource')
    }
  }

  const handleMarkWatched = async (video: Video) => {
    try {
      await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...video,
          status: 'watched',
          date_watched: new Date().toISOString(),
        }),
      })
      toast.success('Marked as watched!')
      fetchVideos()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const hasFilters = search || statusFilter !== 'all' || platformFilter !== 'all'

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold text-slate-100">Videos & Resources</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? '…' : `${videos.length} item${videos.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button
          onClick={() => { setEditVideo(null); setModalOpen(true) }}
          className="bg-blue-600 hover:bg-blue-700 font-mono"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Save Resource
          <kbd className="ml-2 rounded border border-blue-500 bg-blue-700/50 px-1 py-0.5 text-[10px] opacity-70 hidden sm:inline">
            N
          </kbd>
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="pl-8 bg-[#1a1f2e] border-[#2a3042] text-slate-100 placeholder:text-slate-600 h-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-[#1a1f2e] border-[#2a3042] text-slate-300 h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1f2e] border-[#2a3042]">
            <SelectItem value="all" className="text-slate-200 focus:bg-[#2a3042]">All Status</SelectItem>
            <SelectItem value="saved" className="text-slate-200 focus:bg-[#2a3042]">Saved</SelectItem>
            <SelectItem value="watched" className="text-slate-200 focus:bg-[#2a3042]">Watched</SelectItem>
          </SelectContent>
        </Select>

        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-36 bg-[#1a1f2e] border-[#2a3042] text-slate-300 h-9">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1f2e] border-[#2a3042]">
            <SelectItem value="all" className="text-slate-200 focus:bg-[#2a3042]">All Platforms</SelectItem>
            <SelectItem value="YouTube" className="text-slate-200 focus:bg-[#2a3042]">YouTube</SelectItem>
            <SelectItem value="Instagram" className="text-slate-200 focus:bg-[#2a3042]">Instagram</SelectItem>
            <SelectItem value="Twitter/X" className="text-slate-200 focus:bg-[#2a3042]">Twitter/X</SelectItem>
            <SelectItem value="Other" className="text-slate-200 focus:bg-[#2a3042]">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={`${sortBy}:${sortOrder}`} onValueChange={(v) => {
          const [s, o] = v.split(':')
          setSortBy(s)
          setSortOrder(o)
        }}>
          <SelectTrigger className="w-44 bg-[#1a1f2e] border-[#2a3042] text-slate-300 h-9">
            <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1f2e] border-[#2a3042]">
            <SelectItem value="date_added:desc" className="text-slate-200 focus:bg-[#2a3042]">Newest first</SelectItem>
            <SelectItem value="date_added:asc" className="text-slate-200 focus:bg-[#2a3042]">Oldest first</SelectItem>
            <SelectItem value="title:asc" className="text-slate-200 focus:bg-[#2a3042]">Title A–Z</SelectItem>
            <SelectItem value="platform:asc" className="text-slate-200 focus:bg-[#2a3042]">Platform</SelectItem>
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex rounded-md border border-[#2a3042] overflow-hidden h-9">
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 transition-colors ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-[#1a1f2e] text-slate-500 hover:text-slate-200'
            }`}
            title="Table view"
          >
            <Table2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`px-2.5 transition-colors ${
              viewMode === 'card'
                ? 'bg-blue-600 text-white'
                : 'bg-[#1a1f2e] text-slate-500 hover:text-slate-200'
            }`}
            title="Card view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="font-mono text-sm text-slate-600 animate-pulse">Loading…</div>
        </div>
      ) : videos.length === 0 ? (
        <EmptyState
          type="video"
          filtered={!!hasFilters}
          onAdd={() => { setEditVideo(null); setModalOpen(true) }}
        />
      ) : (
        <VideoTable
          videos={videos}
          viewMode={viewMode}
          onEdit={(video) => { setEditVideo(video); setModalOpen(true) }}
          onDelete={handleDelete}
          onMarkWatched={handleMarkWatched}
        />
      )}

      <AddEditModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditVideo(null) }}
        onSuccess={fetchVideos}
        editItem={editVideo}
        editType={editVideo ? 'video' : null}
        defaultType="video"
      />
    </div>
  )
}
