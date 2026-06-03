'use client'

import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1f2e',
            border: '1px solid #2a3042',
            color: '#f1f5f9',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </>
  )
}
