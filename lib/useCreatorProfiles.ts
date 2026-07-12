'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CreatorProfile } from '@/lib/types/libraryItem'

export function useCreatorProfiles(guardianUid?: string): {
  profiles: CreatorProfile[]
  loading: boolean
  error: string | null
} {
  const [profiles, setProfiles] = useState<CreatorProfile[]>([])
  const [loading, setLoading] = useState(Boolean(guardianUid))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!guardianUid) {
      setProfiles([])
      setLoading(false)
      setError(null)
      return () => undefined
    }

    if (!db) {
      setLoading(false)
      setError('Firebase is not configured.')
      return () => undefined
    }

    setLoading(true)
    const unsubscribe = onSnapshot(
      query(collection(db, 'creatorProfiles'), where('guardianUid', '==', guardianUid)),
      (snapshot) => {
        setProfiles(
          snapshot.docs.map((doc) => ({
            ...(doc.data() as Omit<CreatorProfile, 'id'>),
            id: doc.id,
          })),
        )
        setError(null)
        setLoading(false)
      },
      (snapshotError) => {
        setError(snapshotError.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [guardianUid])

  return { profiles, loading, error }
}
