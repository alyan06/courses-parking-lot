import { BookOpen, Video, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ItemType } from '@/lib/types'

interface EmptyStateProps {
  type: ItemType | 'general'
  onAdd?: () => void
  filtered?: boolean
}

export function EmptyState({ type, onAdd, filtered = false }: EmptyStateProps) {
  if (filtered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-slate-500 font-mono text-sm">No results match your filters.</p>
        <p className="text-slate-600 text-xs mt-1">Try adjusting or clearing the filters.</p>
      </div>
    )
  }

  const config = {
    course: {
      icon: BookOpen,
      title: 'No courses yet',
      description: "Start parking the courses you've found. You'll never lose one again.",
      cta: 'Add your first course',
    },
    video: {
      icon: Video,
      title: 'No videos saved yet',
      description: "Saw something useful on YouTube or Instagram? Save it here before you scroll past.",
      cta: 'Save your first video',
    },
    general: {
      icon: BookOpen,
      title: 'Nothing here yet',
      description: 'Start adding courses and videos to your parking lot.',
      cta: 'Add something',
    },
  }[type]

  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#2a3042] bg-[#1a1f2e]">
        <Icon className="h-7 w-7 text-slate-600" />
      </div>
      <h3 className="font-mono text-base font-semibold text-slate-300">{config.title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-slate-500">{config.description}</p>
      {onAdd && (
        <Button
          onClick={onAdd}
          className="mt-5 bg-blue-600 hover:bg-blue-700 font-mono"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          {config.cta}
        </Button>
      )}
    </div>
  )
}
