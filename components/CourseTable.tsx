'use client'

import { ExternalLink, Edit2, Trash2, Clock } from 'lucide-react'
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge'
import { timeAgo } from '@/lib/utils'
import type { Course, CourseStatus } from '@/lib/types'

interface CourseTableProps {
  courses: Course[]
  viewMode: 'table' | 'card'
  onEdit: (course: Course) => void
  onDelete: (id: number) => void
  onStatusCycle: (course: Course) => void
}

const statusCycle: Record<CourseStatus, CourseStatus> = {
  parked: 'in_progress',
  in_progress: 'done',
  done: 'parked',
}

export function CourseTable({ courses, viewMode, onEdit, onDelete, onStatusCycle }: CourseTableProps) {
  if (viewMode === 'card') {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group relative rounded-lg border border-[#2a3042] bg-[#1a1f2e] p-4 hover:border-[#3a4052] transition-all hover:shadow-lg hover:shadow-black/20"
          >
            {/* Actions */}
            <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {course.url && (
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-1.5 text-slate-500 hover:bg-[#2a3042] hover:text-slate-200 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <button
                onClick={() => onEdit(course)}
                className="rounded p-1.5 text-slate-500 hover:bg-[#2a3042] hover:text-slate-200 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(course.id)}
                className="rounded p-1.5 text-slate-500 hover:bg-red-900/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Top row */}
            <div className="flex items-start gap-2 pr-20 mb-2">
              <button
                onClick={() => onStatusCycle(course)}
                title={`Click to advance: ${statusCycle[course.status]}`}
                className="mt-0.5 shrink-0"
              >
                <StatusBadge status={course.status} />
              </button>
            </div>

            {/* Title */}
            <h3 className="font-mono text-sm font-semibold text-slate-100 leading-snug mb-1 line-clamp-2">
              {course.title}
            </h3>

            {/* Provider & Category */}
            <p className="text-xs text-slate-500 mb-3">
              {[course.provider, course.category].filter(Boolean).join(' · ')}
            </p>

            {/* Notes */}
            {course.notes && (
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 italic">
                {course.notes}
              </p>
            )}

            {/* Bottom row */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a3042]">
              <PriorityBadge priority={course.priority} />
              <div className="flex items-center gap-1 text-xs text-slate-600">
                {course.estimated_hours && (
                  <>
                    <Clock className="h-3 w-3" />
                    <span>{course.estimated_hours}h</span>
                    <span className="mx-1">·</span>
                  </>
                )}
                <span>{timeAgo(course.date_added)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[#2a3042] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a3042] bg-[#0d1117]/60">
              <th className="px-4 py-3 text-left font-mono text-xs text-slate-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                Provider
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-slate-500 uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                Priority
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                Hours
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-slate-500 uppercase tracking-wider hidden xl:table-cell">
                Added
              </th>
              <th className="px-4 py-3 text-right font-mono text-xs text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a3042]">
            {courses.map((course) => (
              <tr
                key={course.id}
                className="group bg-[#1a1f2e] hover:bg-[#1f2638] transition-colors"
              >
                <td className="px-4 py-3 max-w-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-slate-100 line-clamp-1">
                      {course.title}
                    </span>
                    {course.url && (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-slate-600 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  {course.notes && (
                    <p className="text-xs text-slate-600 truncate mt-0.5 max-w-xs">{course.notes}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">
                  {course.provider || '—'}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {course.category ? (
                    <span className="rounded border border-[#2a3042] bg-[#0d1117] px-2 py-0.5 text-xs font-mono text-slate-400">
                      {course.category}
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onStatusCycle(course)}
                    title={`Click to advance to: ${statusCycle[course.status]}`}
                    className="hover:scale-105 transition-transform"
                  >
                    <StatusBadge status={course.status} />
                  </button>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <PriorityBadge priority={course.priority} />
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs font-mono hidden lg:table-cell">
                  {course.estimated_hours ? `${course.estimated_hours}h` : '—'}
                </td>
                <td className="px-4 py-3 text-slate-600 text-xs font-mono hidden xl:table-cell">
                  {timeAgo(course.date_added)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(course)}
                      className="rounded p-1.5 text-slate-600 hover:bg-[#2a3042] hover:text-slate-300 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(course.id)}
                      className="rounded p-1.5 text-slate-600 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
