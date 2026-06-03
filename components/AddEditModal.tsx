'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Course, Video, ItemType } from '@/lib/types'

interface AddEditModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  editItem?: Course | Video | null
  editType?: ItemType | null
  defaultType?: ItemType
}

const EMPTY_COURSE = {
  title: '', provider: '', url: '', category: '',
  status: 'parked', priority: 'medium', notes: '', hours: '',
}
const EMPTY_VIDEO = {
  title: '', url: '', platform: 'YouTube', category: '',
  status: 'saved', notes: '', tags: '',
}

export function AddEditModal({
  open,
  onClose,
  onSuccess,
  editItem = null,
  editType = null,
  defaultType = 'course',
}: AddEditModalProps) {
  const isEditing = !!editItem
  const [activeTab, setActiveTab] = useState<ItemType>(editType ?? defaultType)
  const [loading, setLoading] = useState(false)

  // Course state
  const [c, setC] = useState(EMPTY_COURSE)
  // Video state
  const [v, setV] = useState(EMPTY_VIDEO)

  useEffect(() => {
    if (!open) return
    if (editItem && editType) {
      setActiveTab(editType)
      if (editType === 'course') {
        const course = editItem as Course
        setC({
          title: course.title,
          provider: course.provider,
          url: course.url,
          category: course.category,
          status: course.status,
          priority: course.priority,
          notes: course.notes,
          hours: course.estimated_hours?.toString() ?? '',
        })
      } else {
        const video = editItem as Video
        setV({
          title: video.title,
          url: video.source_url,
          platform: video.platform,
          category: video.category,
          status: video.status,
          notes: video.notes,
          tags: video.tags,
        })
      }
    } else {
      setC(EMPTY_COURSE)
      setV(EMPTY_VIDEO)
      setActiveTab(defaultType)
    }
  }, [open, editItem, editType, defaultType])

  const handleClose = () => {
    if (!loading) onClose()
  }

  const submitCourse = async () => {
    if (!c.title.trim()) { toast.error('Title is required'); return }
    setLoading(true)
    try {
      const endpoint = isEditing && editType === 'course'
        ? `/api/courses/${(editItem as Course).id}`
        : '/api/courses'
      const res = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: c.title.trim(),
          provider: c.provider.trim(),
          url: c.url.trim(),
          category: c.category.trim(),
          status: c.status,
          priority: c.priority,
          notes: c.notes.trim(),
          estimated_hours: c.hours ? parseFloat(c.hours) : null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success(isEditing ? 'Course updated!' : 'Course added to the lot!')
      onSuccess()
      onClose()
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const submitVideo = async () => {
    if (!v.title.trim()) { toast.error('Title is required'); return }
    setLoading(true)
    try {
      const endpoint = isEditing && editType === 'video'
        ? `/api/videos/${(editItem as Video).id}`
        : '/api/videos'
      const res = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: v.title.trim(),
          source_url: v.url.trim(),
          platform: v.platform,
          category: v.category.trim(),
          status: v.status,
          notes: v.notes.trim(),
          tags: v.tags.trim(),
        }),
      })
      if (!res.ok) throw new Error()
      toast.success(isEditing ? 'Resource updated!' : 'Resource saved!')
      onSuccess()
      onClose()
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'bg-[#0d1117] border-[#2a3042] text-slate-100 placeholder:text-slate-600 focus-visible:ring-blue-600'
  const selectContentClass = 'bg-[#1a1f2e] border-[#2a3042] text-slate-100'
  const selectItemClass = 'focus:bg-[#2a3042] text-slate-200'

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="bg-[#1a1f2e] border-[#2a3042] text-slate-100 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-slate-100">
            {isEditing ? 'Edit Item' : 'Add to Parking Lot'}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            if (!isEditing) setActiveTab(val as ItemType)
          }}
        >
          <TabsList className="w-full bg-[#0d1117] border border-[#2a3042]">
            <TabsTrigger
              value="course"
              disabled={isEditing && editType !== 'course'}
              className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400"
            >
              Course / Cert
            </TabsTrigger>
            <TabsTrigger
              value="video"
              disabled={isEditing && editType !== 'video'}
              className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400"
            >
              Video / Resource
            </TabsTrigger>
          </TabsList>

          {/* ── COURSE TAB ── */}
          <TabsContent value="course" className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs uppercase tracking-wider">Title *</Label>
              <Input
                value={c.title}
                onChange={(e) => setC({ ...c, title: e.target.value })}
                placeholder="e.g. Complete Web Development Bootcamp"
                className={inputClass}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Provider</Label>
                <Input
                  value={c.provider}
                  onChange={(e) => setC({ ...c, provider: e.target.value })}
                  placeholder="Udemy, Coursera…"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Category</Label>
                <Input
                  value={c.category}
                  onChange={(e) => setC({ ...c, category: e.target.value })}
                  placeholder="CS, AI, Design…"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs uppercase tracking-wider">URL</Label>
              <Input
                value={c.url}
                onChange={(e) => setC({ ...c, url: e.target.value })}
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Status</Label>
                <Select value={c.status} onValueChange={(val) => setC({ ...c, status: val })}>
                  <SelectTrigger className={`${inputClass} h-9`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="parked" className={selectItemClass}>Parked</SelectItem>
                    <SelectItem value="in_progress" className={selectItemClass}>In Progress</SelectItem>
                    <SelectItem value="done" className={selectItemClass}>Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Priority</Label>
                <Select value={c.priority} onValueChange={(val) => setC({ ...c, priority: val })}>
                  <SelectTrigger className={`${inputClass} h-9`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="high" className={selectItemClass}>High</SelectItem>
                    <SelectItem value="medium" className={selectItemClass}>Medium</SelectItem>
                    <SelectItem value="low" className={selectItemClass}>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Est. Hours</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={c.hours}
                  onChange={(e) => setC({ ...c, hours: e.target.value })}
                  placeholder="40"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs uppercase tracking-wider">Notes</Label>
              <Textarea
                value={c.notes}
                onChange={(e) => setC({ ...c, notes: e.target.value })}
                placeholder="Why you saved it, what to focus on…"
                className={`${inputClass} resize-none`}
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="border-[#2a3042] text-slate-400 hover:bg-[#2a3042] hover:text-slate-100"
              >
                Cancel
              </Button>
              <Button
                onClick={submitCourse}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 font-mono"
              >
                {loading ? 'Saving…' : isEditing ? 'Update Course' : 'Add Course'}
              </Button>
            </div>
          </TabsContent>

          {/* ── VIDEO TAB ── */}
          <TabsContent value="video" className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs uppercase tracking-wider">Title *</Label>
              <Input
                value={v.title}
                onChange={(e) => setV({ ...v, title: e.target.value })}
                placeholder="e.g. How to Learn Anything Fast"
                className={inputClass}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs uppercase tracking-wider">URL</Label>
              <Input
                value={v.url}
                onChange={(e) => setV({ ...v, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Platform</Label>
                <Select value={v.platform} onValueChange={(val) => setV({ ...v, platform: val })}>
                  <SelectTrigger className={`${inputClass} h-9`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="YouTube" className={selectItemClass}>YouTube</SelectItem>
                    <SelectItem value="Instagram" className={selectItemClass}>Instagram</SelectItem>
                    <SelectItem value="Twitter/X" className={selectItemClass}>Twitter/X</SelectItem>
                    <SelectItem value="Other" className={selectItemClass}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Category</Label>
                <Input
                  value={v.category}
                  onChange={(e) => setV({ ...v, category: e.target.value })}
                  placeholder="CS, AI…"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Status</Label>
                <Select value={v.status} onValueChange={(val) => setV({ ...v, status: val })}>
                  <SelectTrigger className={`${inputClass} h-9`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="saved" className={selectItemClass}>Saved</SelectItem>
                    <SelectItem value="watched" className={selectItemClass}>Watched</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs uppercase tracking-wider">
                Tags <span className="text-slate-600 normal-case">(comma-separated)</span>
              </Label>
              <Input
                value={v.tags}
                onChange={(e) => setV({ ...v, tags: e.target.value })}
                placeholder="javascript, tutorial, productivity"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs uppercase tracking-wider">Notes</Label>
              <Textarea
                value={v.notes}
                onChange={(e) => setV({ ...v, notes: e.target.value })}
                placeholder="Why you saved it, key takeaways…"
                className={`${inputClass} resize-none`}
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="border-[#2a3042] text-slate-400 hover:bg-[#2a3042] hover:text-slate-100"
              >
                Cancel
              </Button>
              <Button
                onClick={submitVideo}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 font-mono"
              >
                {loading ? 'Saving…' : isEditing ? 'Update Resource' : 'Save Resource'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
