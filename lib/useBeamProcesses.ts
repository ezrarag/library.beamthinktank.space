'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where, type DocumentData } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { BeamProcess, BeamProcessStage } from '@/lib/types/beamProcess'

export interface UseBeamProcessesResult {
  processes: BeamProcess[]
  loading: boolean
  error: Error | null
}

function toIsoString(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'toDate' in value) {
    const toDate = (value as { toDate?: unknown }).toDate
    if (typeof toDate === 'function') return (toDate.call(value) as Date).toISOString()
  }
  return ''
}

function normalizeStage(value: BeamProcessStage): BeamProcessStage {
  return { ...value, updatedAt: toIsoString(value.updatedAt) }
}

function normalizeProcess(id: string, data: DocumentData): BeamProcess {
  return {
    ...(data as Omit<BeamProcess, 'id'>),
    id,
    stages: Array.isArray(data.stages) ? (data.stages as BeamProcessStage[]).map(normalizeStage) : [],
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
}

export function useBeamProcesses(): UseBeamProcessesResult {
  const [processes, setProcesses] = useState<BeamProcess[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!db) {
      setLoading(false)
      setError(new Error('Firebase is not configured.'))
      return () => undefined
    }

    return onSnapshot(
      query(collection(db, 'beamProcesses'), where('domain', '==', 'library')),
      (snapshot) => {
        setProcesses(
          snapshot.docs
            .map((document) => normalizeProcess(document.id, document.data()))
            .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
        )
        setError(null)
        setLoading(false)
      },
      (snapshotError) => {
        setError(snapshotError)
        setLoading(false)
      },
    )
  }, [])

  return { processes, loading, error }
}
