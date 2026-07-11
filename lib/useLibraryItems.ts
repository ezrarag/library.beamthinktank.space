'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { LibraryItem } from '@/lib/types/libraryItem'

export function useLibraryItems(): {
  items: LibraryItem[]
  loading: boolean
  error: string | null
} {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!db) {
      setLoading(false)
      setError('Firebase is not configured.')
      return () => undefined
    }

    const unsubscribe = onSnapshot(
      collection(db, 'libraryItems'),
      (snapshot) => {
        setItems(
          snapshot.docs.map((doc) => ({
            ...(doc.data() as Omit<LibraryItem, 'id'>),
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
  }, [])

  return { items, loading, error }
}
