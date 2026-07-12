'use client'

import { useState, type FormEvent } from 'react'
import { collection, doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { PortalShell } from '@/components/PortalShell'
import { usePortalAccessState } from '@/components/PortalAccessProvider'
import { db, storage } from '@/lib/firebase'
import { libraryConfig } from '@/lib/ngoConfig'
import type { LibraryItemMedium, MarketplaceListing } from '@/lib/types/libraryItem'
import { useLibraryItems } from '@/lib/useLibraryItems'
import { useCreatorProfiles } from '@/lib/useCreatorProfiles'

const media: LibraryItemMedium[] = ['photography', 'craft', 'textile', 'writing', 'music', 'video', 'mixed', 'other']
const fieldClass = 'mt-1 w-full rounded-2xl border border-white/10 bg-[#111a26] px-4 py-3 text-white outline-none focus:border-grounds-sand/50'

export default function Page() {
  const { user } = usePortalAccessState()
  const { items, loading, error } = useLibraryItems()
  const { profiles, loading: profilesLoading, error: profilesError } = useCreatorProfiles(user?.uid)
  const accountHolderName = user?.displayName?.trim() || user?.email?.trim() || 'Myself'
  const [title, setTitle] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [medium, setMedium] = useState<LibraryItemMedium>('photography')
  const [story, setStory] = useState('')
  const [teachingOffer, setTeachingOffer] = useState('')
  const [marketplaceStatus, setMarketplaceStatus] = useState<MarketplaceListing['status']>('none')
  const [files, setFiles] = useState<File[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [newCreatorName, setNewCreatorName] = useState('')
  const [isAddingCreator, setIsAddingCreator] = useState(false)
  const [creatorMessage, setCreatorMessage] = useState<string | null>(null)
  const myItems = items.filter((item) => item.accountHolderUid === user?.uid)

  function clearForm() {
    setTitle('')
    setCreatorName('')
    setMedium('photography')
    setStory('')
    setTeachingOffer('')
    setMarketplaceStatus('none')
    setFiles([])
  }

  async function handleAddCreator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCreatorMessage(null)
    if (!db) return setCreatorMessage('Firebase is not configured.')
    if (!user) return setCreatorMessage('Sign in before adding a creator.')
    const displayName = newCreatorName.trim()
    if (!displayName) return setCreatorMessage('Creator name is required.')

    setIsAddingCreator(true)
    try {
      const profileRef = doc(collection(db, 'creatorProfiles'))
      await setDoc(profileRef, {
        displayName,
        guardianUid: user.uid,
        createdAt: new Date().toISOString(),
      })
      setNewCreatorName('')
      setCreatorMessage(`Added — ${displayName}`)
    } catch (creatorError) {
      setCreatorMessage(creatorError instanceof Error ? creatorError.message : 'Unable to add creator.')
    } finally {
      setIsAddingCreator(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    if (!db || !storage) return setMessage('Firebase is not configured.')
    if (!user) return setMessage('Sign in before adding a work.')
    if (!title.trim() || !creatorName.trim() || !story.trim()) return setMessage('Title, creator name, and story are required.')
    const firebaseStorage = storage

    setIsSaving(true)
    try {
      const itemRef = doc(collection(db, 'libraryItems'))
      const mediaUrls = await Promise.all(
        files.map(async (file, index) => {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
          const result = await uploadBytes(ref(firebaseStorage, `library/${user.uid}/${itemRef.id}/${index}-${safeName}`), file)
          return getDownloadURL(result.ref)
        }),
      )
      const now = new Date().toISOString()
      await setDoc(itemRef, {
        title: title.trim(),
        creatorName: creatorName.trim(),
        accountHolderUid: user.uid,
        medium,
        story: story.trim(),
        regionId: 'milwaukee-wi',
        status: 'SUBMITTED',
        mediaUrls,
        ...(teachingOffer.trim() ? { teachingOffer: teachingOffer.trim() } : {}),
        marketplace: { status: marketplaceStatus },
        createdAt: now,
        updatedAt: now,
      })
      setMessage(`Submitted — ${title.trim()}`)
      clearForm()
    } catch (submissionError) {
      setMessage(submissionError instanceof Error ? submissionError.message : 'Unable to add work.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PortalShell config={libraryConfig} title="Member dashboard" description="Share your work and follow its journey into the collection.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-medium text-white">My Works</p>
          <div className="mt-4 grid gap-3">
            {loading && <p className="text-sm text-white/55">Loading your works…</p>}
            {error && <p className="text-sm text-red-300">{error}</p>}
            {!loading && !error && myItems.length === 0 && <p className="text-sm text-white/55">You have not submitted any works yet.</p>}
            {myItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><h2 className="font-medium">{item.title}</h2><p className="mt-1 text-sm text-white/55">{item.creatorName} · {item.medium}</p></div>
                  <span className="rounded-full bg-grounds-sand/15 px-3 py-1 text-xs font-semibold text-grounds-sand">{item.status}</span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-white/70">{item.story}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-6">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-medium text-white">My Creators</p>
          <p className="mt-2 text-sm text-white/50">Choose yourself or link a young creator whose work you help steward.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-grounds-sand/30 bg-grounds-sand/10 px-3 py-1.5 text-sm text-grounds-sand">{accountHolderName} <span className="text-xs opacity-60">(myself)</span></span>
            {profiles.map((profile) => <span key={profile.id} className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-sm text-white/75">{profile.displayName}</span>)}
          </div>
          {profilesLoading && <p className="mt-3 text-sm text-white/50">Loading creators…</p>}
          {profilesError && <p className="mt-3 text-sm text-red-300">{profilesError}</p>}
          <form onSubmit={handleAddCreator} className="mt-5 border-t border-white/10 pt-4">
            <label className="block text-sm text-white/70">Add a young creator<input value={newCreatorName} onChange={(event) => setNewCreatorName(event.target.value)} placeholder="Display name" required className={fieldClass} /></label>
            {creatorMessage && <p className="mt-3 text-sm text-white/65">{creatorMessage}</p>}
            <button type="submit" disabled={isAddingCreator || !user} className="mt-3 rounded-full border border-grounds-sand/40 px-4 py-2 text-sm font-semibold text-grounds-sand disabled:opacity-40">{isAddingCreator ? 'Adding…' : 'Add creator'}</button>
          </form>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-white">Add a Work</p><button type="button" onClick={clearForm} className="text-sm font-medium text-grounds-sand hover:text-white">Clear</button></div>
          <div className="mt-4 grid gap-3">
            <label className="block text-sm text-white/70">Title<input value={title} onChange={(event) => setTitle(event.target.value)} required className={fieldClass} /></label>
            <label className="block text-sm text-white/70">Creator<select value={creatorName} onChange={(event) => setCreatorName(event.target.value)} required className={fieldClass}><option value="">Select a creator</option><option value={accountHolderName}>{accountHolderName} (myself)</option>{profiles.map((profile) => <option key={profile.id} value={profile.displayName}>{profile.displayName}</option>)}</select></label>
            <label className="block text-sm text-white/70">Medium<select value={medium} onChange={(event) => setMedium(event.target.value as LibraryItemMedium)} className={fieldClass}>{media.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="block text-sm text-white/70">Story<textarea value={story} onChange={(event) => setStory(event.target.value)} required rows={5} className={fieldClass} /></label>
            <label className="block text-sm text-white/70">Teaching offer <span className="text-white/40">(optional)</span><input value={teachingOffer} onChange={(event) => setTeachingOffer(event.target.value)} placeholder="Willing to teach crochet classes" className={fieldClass} /></label>
            <label className="block text-sm text-white/70">Marketplace intent<select value={marketplaceStatus} onChange={(event) => setMarketplaceStatus(event.target.value as MarketplaceListing['status'])} className={fieldClass}><option value="none">None</option><option value="planned">Planned</option></select></label>
            <label className="block text-sm text-white/70">Media <span className="text-white/40">(optional)</span><input type="file" multiple accept="image/*,video/*,audio/*,.pdf" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-grounds-sand file:px-3 file:py-2 file:font-semibold file:text-[#111820]`} /></label>
            {files.length > 0 && <p className="text-xs text-white/50">{files.length} file{files.length === 1 ? '' : 's'} selected</p>}
            {message && <p className="text-sm text-white/70">{message}</p>}
            <button type="submit" disabled={isSaving || !user} className="button mt-1 justify-center disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? 'Submitting…' : 'Submit work'}</button>
          </div>
        </form>
        </div>
      </div>
    </PortalShell>
  )
}
