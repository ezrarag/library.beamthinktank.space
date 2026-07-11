'use client'

import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { PortalShell } from '@/components/PortalShell'
import { db } from '@/lib/firebase'
import { libraryConfig } from '@/lib/ngoConfig'
import type { LibraryItem, LibraryItemStatus, MarketplaceListing } from '@/lib/types/libraryItem'
import { useLibraryItems } from '@/lib/useLibraryItems'

const statuses: LibraryItemStatus[] = ['SUBMITTED', 'CATALOGED', 'DIGITIZED', 'DISPLAYED', 'ARCHIVED']

function CuratorItem({ item }: { item: LibraryItem }) {
  const [marketplaceStatus, setMarketplaceStatus] = useState(item.marketplace.status)
  const [externalUrl, setExternalUrl] = useState(item.marketplace.externalUrl ?? '')
  const [message, setMessage] = useState<string | null>(null)
  const [printing, setPrinting] = useState(false)
  const statusIndex = statuses.indexOf(item.status)
  const itemUrl = `${typeof window === 'undefined' ? libraryConfig.siteUrl : window.location.origin}/catalog/${item.id}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(itemUrl)}`

  async function changeStatus(direction: -1 | 1) {
    if (!db) return setMessage('Firebase is not configured.')
    const nextStatus = statuses[statusIndex + direction]
    if (!nextStatus) return
    try {
      await updateDoc(doc(db, 'libraryItems', item.id), { status: nextStatus, updatedAt: new Date().toISOString() })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update status.')
    }
  }

  async function saveMarketplace() {
    if (!db) return setMessage('Firebase is not configured.')
    const marketplace: MarketplaceListing = {
      ...item.marketplace,
      status: marketplaceStatus,
      ...(externalUrl.trim() ? { externalUrl: externalUrl.trim() } : {}),
    }
    if (!externalUrl.trim()) delete marketplace.externalUrl
    try {
      await updateDoc(doc(db, 'libraryItems', item.id), { marketplace, updatedAt: new Date().toISOString() })
      setMessage('Marketplace saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save marketplace.')
    }
  }

  function printLabel() {
    setPrinting(true)
    window.setTimeout(() => {
      window.print()
      setPrinting(false)
    }, 0)
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <h3 className="font-semibold">{item.title}</h3>
      <p className="mt-1 text-xs text-white/50">{item.creatorName} · {item.medium}</p>
      <p className="mt-3 line-clamp-3 text-sm text-white/70">{item.story}</p>
      <div className="mt-4 flex gap-2">
        <button type="button" disabled={statusIndex === 0} onClick={() => void changeStatus(-1)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs disabled:opacity-30">← Regress</button>
        <button type="button" disabled={statusIndex === statuses.length - 1} onClick={() => void changeStatus(1)} className="rounded-full bg-grounds-sand px-3 py-1.5 text-xs font-semibold text-[#111820] disabled:opacity-30">Advance →</button>
      </div>
      <div className="mt-4 border-t border-white/10 pt-4">
        <label className="text-xs text-white/60">Marketplace status<select value={marketplaceStatus} onChange={(event) => setMarketplaceStatus(event.target.value as MarketplaceListing['status'])} className="mt-1 w-full rounded-xl border border-white/10 bg-[#111a26] px-3 py-2 text-sm text-white"><option value="none">None</option><option value="planned">Planned</option><option value="listed">Listed</option></select></label>
        <label className="mt-3 block text-xs text-white/60">External URL<input type="url" value={externalUrl} onChange={(event) => setExternalUrl(event.target.value)} placeholder="https://market.beamthinktank.space/..." className="mt-1 w-full rounded-xl border border-white/10 bg-[#111a26] px-3 py-2 text-sm text-white" /></label>
        <button type="button" onClick={() => void saveMarketplace()} className="mt-3 text-xs font-semibold text-grounds-sand">Save marketplace</button>
      </div>
      <div className={`print-label mt-4 border-t border-white/10 pt-4 text-center ${printing ? 'print-target' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrUrl} alt={`QR code for ${item.title}`} className="mx-auto h-28 w-28 rounded-lg bg-white p-1" />
        <p className="print-only mt-2 hidden font-semibold">{item.title}</p><p className="print-only hidden text-sm">{item.creatorName}</p>
        <button type="button" onClick={printLabel} className="mt-3 text-xs font-semibold text-grounds-sand print:hidden">Print label</button>
      </div>
      {message && <p className="mt-3 text-xs text-white/60">{message}</p>}
    </article>
  )
}

export default function Page() {
  const { items, loading, error } = useLibraryItems()
  return (
    <PortalShell config={libraryConfig} title="Curation board" description="Move community works from intake through cataloging, digitization, display, and storage.">
      <style jsx global>{`@media print { body * { visibility: hidden !important; } .print-target, .print-target * { visibility: visible !important; } .print-target { position: fixed; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #000; background: #fff; } .print-target img { width: 220px; height: 220px; } .print-target .print-only { display: block !important; } }`}</style>
      {loading && <p className="text-sm text-white/60">Loading collection…</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="grid gap-4 xl:grid-cols-5">
        {statuses.map((status) => {
          const columnItems = items.filter((item) => item.status === status)
          return <section key={status} className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.025] p-3"><div className="flex items-center justify-between px-1 py-2"><h2 className="text-xs font-semibold tracking-wide text-grounds-sand">{status}</h2><span className="text-xs text-white/40">{columnItems.length}</span></div><div className="mt-2 grid gap-3">{columnItems.map((item) => <CuratorItem key={item.id} item={item} />)}{!loading && columnItems.length === 0 && <p className="px-1 py-4 text-xs text-white/35">No items</p>}</div></section>
        })}
      </div>
    </PortalShell>
  )
}
