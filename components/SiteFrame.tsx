'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { NGOConfig } from '@/lib/ngoConfig'

export function SiteFrame({ children, config }: { children: ReactNode; config: NGOConfig }) {
  const isHome = usePathname() === '/'

  if (isHome) return <main>{children}</main>

  return <div className="flex min-h-screen flex-col"><AppHeader config={config} /><main className="flex-1">{children}</main><SiteFooter config={config} /></div>
}
