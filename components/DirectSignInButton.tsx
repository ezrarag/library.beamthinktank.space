'use client'

import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { signInWithGoogle } from '@/lib/firebase'

export function DirectSignInButton() {
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn() {
    setIsStarting(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Unable to start Google sign-in.')
      setIsStarting(false)
    }
  }

  return <div><button type="button" onClick={() => void handleSignIn()} disabled={isStarting} className="button disabled:cursor-not-allowed disabled:opacity-50"><LogIn className="h-4 w-4" />{isStarting ? 'Opening Google…' : 'Sign in directly'}</button>{error && <p className="mt-3 text-sm text-red-300">{error}</p>}</div>
}
