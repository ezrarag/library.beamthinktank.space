'use client'
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import { useLibraryItems } from '@/lib/useLibraryItems'

export default function Catalog() {
  const { items, loading, error } = useLibraryItems()
  const displayed = items.filter((item) => item.status === 'DISPLAYED')
  return <main className="page"><p className="eyebrow">Public catalog</p><h1 className="mt-4 text-5xl font-semibold">Browse the collection</h1><p className="mt-4 text-white/65">Community works, stories, and living cultural knowledge.</p>{loading && <p className="mt-10 text-white/55">Loading collection…</p>}{error && <p className="mt-10 text-red-300">{error}</p>}<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{displayed.map((item) => <Link key={item.id} href={`/catalog/${item.id}`} className="surface-panel overflow-hidden transition hover:-translate-y-1 hover:border-grounds-sand/40">{item.mediaUrls[0] && /* eslint-disable-next-line @next/next/no-img-element */ <img src={item.mediaUrls[0]} alt="" className="aspect-[4/3] w-full object-cover" />}<div className="p-6"><span className="rounded-full bg-grounds-sand/15 px-3 py-1 text-xs font-semibold text-grounds-sand">{item.medium}</span><h2 className="mt-4 text-xl font-semibold">{item.title}</h2><p className="mt-1 text-sm text-white/55">{item.creatorName}</p><p className="mt-3 line-clamp-3 text-sm text-white/70">{item.story}</p></div></Link>)}{!loading && !error && displayed.length === 0 && <p className="text-white/55">No works are currently on display.</p>}</div></main>
}
