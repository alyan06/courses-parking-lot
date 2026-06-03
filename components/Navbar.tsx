'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Video, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/videos', label: 'Videos', icon: Video },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 border-b border-[#2a3042] bg-[#0d1117]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-mono text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
              Parking Lot
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'bg-[#1a1f2e] text-blue-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#1a1f2e]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Keyboard hint */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-600">
            <kbd className="rounded border border-[#2a3042] bg-[#1a1f2e] px-1.5 py-0.5 font-mono">N</kbd>
            <span>quick add</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 text-slate-400 hover:text-slate-100"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-[#2a3042] py-2 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'bg-[#1a1f2e] text-blue-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#1a1f2e]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
