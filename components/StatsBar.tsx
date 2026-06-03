import { BookOpen, Play, CheckCircle2, Video, Eye } from 'lucide-react'
import type { Stats } from '@/lib/types'

interface StatsBarProps {
  stats: Stats | null
}

const statCards = [
  {
    key: 'total_parked' as keyof Stats,
    label: 'Parked',
    icon: BookOpen,
    color: 'text-slate-400',
    bg: 'bg-slate-800/40',
    border: 'border-slate-700/50',
    dot: 'bg-slate-500',
  },
  {
    key: 'total_in_progress' as keyof Stats,
    label: 'In Progress',
    icon: Play,
    color: 'text-blue-400',
    bg: 'bg-blue-950/40',
    border: 'border-blue-800/50',
    dot: 'bg-blue-500',
  },
  {
    key: 'total_done' as keyof Stats,
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-800/50',
    dot: 'bg-emerald-500',
  },
  {
    key: 'total_saved' as keyof Stats,
    label: 'Videos Saved',
    icon: Video,
    color: 'text-purple-400',
    bg: 'bg-purple-950/40',
    border: 'border-purple-800/50',
    dot: 'bg-purple-500',
  },
  {
    key: 'total_watched' as keyof Stats,
    label: 'Watched',
    icon: Eye,
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-800/50',
    dot: 'bg-amber-500',
  },
]

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {statCards.map(({ key, label, icon: Icon, color, bg, border, dot }) => (
        <div
          key={key}
          className={`flex items-center gap-3 rounded-lg border p-3.5 ${bg} ${border} transition-all hover:scale-[1.02]`}
        >
          <div className={`shrink-0 rounded-md p-2 ${bg} border ${border}`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div className="min-w-0">
            <p className={`text-2xl font-mono font-bold ${color}`}>
              {stats ? stats[key] : <span className="animate-pulse">—</span>}
            </p>
            <p className="text-xs text-slate-500 truncate">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
