import { cn } from '@/lib/utils'
import type { CourseStatus, VideoStatus, CoursePriority } from '@/lib/types'

interface StatusBadgeProps {
  status: CourseStatus | VideoStatus
  className?: string
}

const courseStatusConfig: Record<CourseStatus, { label: string; classes: string }> = {
  parked: {
    label: 'Parked',
    classes: 'bg-slate-800 text-slate-400 border-slate-700',
  },
  in_progress: {
    label: 'In Progress',
    classes: 'bg-blue-950 text-blue-400 border-blue-800',
  },
  done: {
    label: 'Done',
    classes: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  },
}

const videoStatusConfig: Record<VideoStatus, { label: string; classes: string }> = {
  saved: {
    label: 'Saved',
    classes: 'bg-slate-800 text-slate-400 border-slate-700',
  },
  watched: {
    label: 'Watched',
    classes: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config =
    courseStatusConfig[status as CourseStatus] ||
    videoStatusConfig[status as VideoStatus] || {
      label: status,
      classes: 'bg-slate-800 text-slate-400 border-slate-700',
    }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  )
}

interface PriorityBadgeProps {
  priority: CoursePriority
  className?: string
}

const priorityConfig: Record<CoursePriority, { label: string; classes: string }> = {
  high: {
    label: '↑ High',
    classes: 'bg-amber-950 text-amber-400 border-amber-800',
  },
  medium: {
    label: '→ Med',
    classes: 'bg-blue-950/50 text-blue-400/80 border-blue-900',
  },
  low: {
    label: '↓ Low',
    classes: 'bg-slate-800/50 text-slate-500 border-slate-700/50',
  },
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  )
}
