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
import { CourseTable } from '@/components/CourseTable'
import { EmptyState } from '@/components/EmptyState'
import type { Course, CourseStatus } from '@/lib/types'

const statusCycle: Record<CourseStatus, CourseStatus> = {
  parked: 'in_progress',
  in_progress: 'done',
  done: 'parked',
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date_added')
  const [sortOrder, setSortOrder] = useState('desc')

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (priorityFilter !== 'all') params.set('priority', priorityFilter)
      params.set('sort', sortBy)
      params.set('order', sortOrder)
      const res = await fetch(`/api/courses?${params}`)
      const data = await res.json()
      setCourses(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, priorityFilter, sortBy, sortOrder])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // "N" key shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        const tag = (e.target as HTMLElement).tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault()
          setEditCourse(null)
          setModalOpen(true)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this course? This cannot be undone.')) return
    try {
      await fetch(`/api/courses/${id}`, { method: 'DELETE' })
      toast.success('Course removed')
      fetchCourses()
    } catch {
      toast.error('Failed to delete course')
    }
  }

  const handleStatusCycle = async (course: Course) => {
    const newStatus = statusCycle[course.status]
    try {
      await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...course, status: newStatus }),
      })
      toast.success(`Moved to ${newStatus.replace('_', ' ')}`)
      fetchCourses()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const filtered = courses.length === 0 && !loading
  const hasFilters = search || statusFilter !== 'all' || priorityFilter !== 'all'

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold text-slate-100">Courses & Certs</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? '…' : `${courses.length} item${courses.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button
          onClick={() => { setEditCourse(null); setModalOpen(true) }}
          className="bg-blue-600 hover:bg-blue-700 font-mono"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Course
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
          <SelectTrigger className="w-36 bg-[#1a1f2e] border-[#2a3042] text-slate-300 h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1f2e] border-[#2a3042]">
            <SelectItem value="all" className="text-slate-200 focus:bg-[#2a3042]">All Status</SelectItem>
            <SelectItem value="parked" className="text-slate-200 focus:bg-[#2a3042]">Parked</SelectItem>
            <SelectItem value="in_progress" className="text-slate-200 focus:bg-[#2a3042]">In Progress</SelectItem>
            <SelectItem value="done" className="text-slate-200 focus:bg-[#2a3042]">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-36 bg-[#1a1f2e] border-[#2a3042] text-slate-300 h-9">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1f2e] border-[#2a3042]">
            <SelectItem value="all" className="text-slate-200 focus:bg-[#2a3042]">All Priority</SelectItem>
            <SelectItem value="high" className="text-slate-200 focus:bg-[#2a3042]">High</SelectItem>
            <SelectItem value="medium" className="text-slate-200 focus:bg-[#2a3042]">Medium</SelectItem>
            <SelectItem value="low" className="text-slate-200 focus:bg-[#2a3042]">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={`${sortBy}:${sortOrder}`} onValueChange={(v) => {
          const [s, o] = v.split(':')
          setSortBy(s)
          setSortOrder(o)
        }}>
          <SelectTrigger className="w-48 bg-[#1a1f2e] border-[#2a3042] text-slate-300 h-9">
            <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1f2e] border-[#2a3042]">
            <SelectItem value="date_added:desc" className="text-slate-200 focus:bg-[#2a3042]">Newest first</SelectItem>
            <SelectItem value="date_added:asc" className="text-slate-200 focus:bg-[#2a3042]">Oldest first</SelectItem>
            <SelectItem value="priority:asc" className="text-slate-200 focus:bg-[#2a3042]">Priority: High first</SelectItem>
            <SelectItem value="priority:desc" className="text-slate-200 focus:bg-[#2a3042]">Priority: Low first</SelectItem>
            <SelectItem value="estimated_hours:desc" className="text-slate-200 focus:bg-[#2a3042]">Hours: Most</SelectItem>
            <SelectItem value="estimated_hours:asc" className="text-slate-200 focus:bg-[#2a3042]">Hours: Least</SelectItem>
            <SelectItem value="title:asc" className="text-slate-200 focus:bg-[#2a3042]">Title A–Z</SelectItem>
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
      ) : courses.length === 0 ? (
        <EmptyState
          type="course"
          filtered={!!hasFilters}
          onAdd={() => { setEditCourse(null); setModalOpen(true) }}
        />
      ) : (
        <CourseTable
          courses={courses}
          viewMode={viewMode}
          onEdit={(course) => { setEditCourse(course); setModalOpen(true) }}
          onDelete={handleDelete}
          onStatusCycle={handleStatusCycle}
        />
      )}

      <AddEditModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditCourse(null) }}
        onSuccess={fetchCourses}
        editItem={editCourse}
        editType={editCourse ? 'course' : null}
        defaultType="course"
      />
    </div>
  )
}
