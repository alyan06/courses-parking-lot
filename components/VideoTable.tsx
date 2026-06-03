'use client'

import { ExternalLink, Edit2, Trash2, Eye } from 'lucide-react'
import { StatusBadge } from '@/components/StatusBadge'
import { timeAgo, parseTags } from '@/lib/utils'
import type { Video } from '@/lib/types'

const platformColors: Record<string, string> = {
  YouTube: 'bg-red-950 text-red-400 border-red-900',
  Instagram: 'bg-pink-950 text-pink-400 border-pink-900',
  'Twitter/X': 'bg-sky-950 text-sky-400 border-sky-900',
  Other: 'bg-slate-800 text-slate-400 border-slate-700',
}

interface VideoTableProps {
  videos: Video[]
  viewMode: 'table' | 'card'
  onEdit: (video: Video) => void
  onDelete: (id: number) => void
  onMarkWatched: (video: Video) => void
}

export function VideoTable({ videos, viewMode, onEdit, onDelete, onMarkWatched }: VideoTableProps) {
  if (viewMode === 'card') {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const tags = parseTags(video.tags)
          const platformClass = platformColors[video.platform] ?? platformColors.Other
          return (
            <div
              key={video.id}
              className="group relative rounded-lg border border-[#2a3042] bg-[#1a1f2e] p-4 hover:border-[#3a4052] transition-all hover:shadow-lg hover:shadow-black/20"
            >
              {/* Actions */}
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {video.source_url && (
                  <a
                    href={video.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-1.5 text-slate-500 hover:bg-[#2a3042] hover:text-slate-200 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={() => onEdit(video)}
                  className="rounded p-1.5 text-slate-500 hover:bg-[#2a3042] hover:text-slate-200 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(video.id)}
                  className="rounded p-1.5 text-slate-500 hover:bg-red-900/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Platform + Status */}
              <div className="flex items-center gap-2 pr-20 mb-2">
                <span
                  className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium ${platformClass}`}
                >
                  {video.platform}
                </span>
                <StatusBadge status={video.status} />
              </div>

              {/* Title */}
              <h3 className="font-mono text-sm font-semibold text-slate-100 leading-snug mb-1 line-clamp-2">
                {video.title}
              </h3>

              {/* Category */}
              {video.category && (
                <p className="text-xs text-slate-500 mb-1">{video.category}</p>
              )}

              {/* Notes */}
              {video.notes && (
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 italic">{video.notes}</p>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-[#2a3042] bg-[#0d1117] px-1.5 py-0.5 text-xs font-mono text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom row */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a3042]">
                {video.status === 'saved' && (
                  <button
                    onClick={() => onMarkWatched(video)}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs font-mono text-slate-500 hover:bg-emerald-900/30 hover:text-emerald-400 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    Mark watched
                  </button>
                )}
                <span className="ml-auto text-xs text-slate-600 font-mono">
                  {timeAgo(video.date_added)}
                </span>
              </div>
            </div>
          )
        })}
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
                Platform
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-slate-500 uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                Tags
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
            {videos.map((video) => {
              const tags = parseTags(video.tags)
              const platformClass = platformColors[video.platform] ?? platformColors.Other
              return (
                <tr
                  key={video.id}
                  className="group bg-[#1a1f2e] hover:bg-[#1f2638] transition-colors"
                >
                  <td className="px-4 py-3 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-slate-100 line-clamp-1">
                        {video.title}
                      </span>
                      {video.source_url && (
                        <a
                          href={video.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-slate-600 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    {video.notes && (
                      <p className="text-xs text-slate-600 truncate mt-0.5 max-w-xs">{video.notes}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium ${platformClass}`}
                    >
                      {video.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">
                    {video.category || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={video.status} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm border border-[#2a3042] bg-[#0d1117] px-1.5 py-0.5 text-xs font-mono text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs font-mono hidden xl:table-cell">
                    {timeAgo(video.date_added)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {video.status === 'saved' && (
                        <button
                          onClick={() => onMarkWatched(video)}
                          title="Mark as watched"
                          className="rounded p-1.5 text-slate-600 hover:bg-emerald-900/30 hover:text-emerald-400 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(video)}
                        className="rounded p-1.5 text-slate-600 hover:bg-[#2a3042] hover:text-slate-300 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(video.id)}
                        className="rounded p-1.5 text-slate-600 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
