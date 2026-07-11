'use client'
/* eslint-disable @next/next/no-img-element */

import { useParams } from 'next/navigation'
import { libraryConfig } from '@/lib/ngoConfig'
import { useLibraryItems } from '@/lib/useLibraryItems'

export default function CatalogItemPage() {
  const params = useParams<{ id: string }>()
  const { items, loading, error } = useLibraryItems()
  const item = items.find((candidate) => candidate.id === params.id && candidate.status === 'DISPLAYED')
  const itemUrl = `${typeof window === 'undefined' ? libraryConfig.siteUrl : window.location.origin}/catalog/${params.id}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(itemUrl)}`
  if (loading) return <main className="page"><p>Loading work…</p></main>
  if (error) return <main className="page"><p className="text-red-300">{error}</p></main>
  if (!item) return <main className="page"><h1 className="text-4xl font-semibold">Work not found</h1><p className="mt-4 text-white/60">This item is not currently displayed in the public catalog.</p></main>
  return <main className="page"><p className="eyebrow">{item.medium}</p><h1 className="mt-4 text-5xl font-semibold">{item.title}</h1><p className="mt-3 text-xl text-white/60">By {item.creatorName}</p><div className="mt-10 grid gap-10 lg:grid-cols-[1fr_18rem]"><div><div className="grid gap-4 sm:grid-cols-2">{item.mediaUrls.map((url, index) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={url} src={url} alt={`${item.title} media ${index + 1}`} className="w-full rounded-3xl border border-white/10 object-cover" />)}</div><section className="mt-10"><h2 className="text-2xl font-semibold">The story</h2><p className="mt-4 whitespace-pre-wrap leading-7 text-white/75">{item.story}</p></section>{item.teachingOffer && <section className="mt-8 rounded-3xl border border-grounds-sand/25 bg-grounds-sand/10 p-6"><p className="eyebrow">Teaching offer</p><p className="mt-3 text-white/80">{item.teachingOffer}</p></section>}{item.marketplace.status === 'listed' && item.marketplace.externalUrl && <a href={item.marketplace.externalUrl} target="_blank" rel="noreferrer" className="button mt-8">Visit Marketplace</a>}</div><aside className="surface-panel h-fit p-6 text-center"><p className="text-sm font-medium">Open this item on your phone</p>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={qrUrl} alt={`QR code for ${item.title}`} className="mx-auto mt-4 h-[220px] w-[220px] rounded-xl bg-white p-2" /><p className="mt-3 text-xs text-white/45">Scan with any phone camera</p></aside></div></main>
}
