'use client'
import { usePathname } from 'next/navigation'
import { usePortalAccessState } from '@/components/PortalAccessProvider'
import { buildHandoffUrl } from '@/lib/beam-home'
import { resolvePortalPath } from '@/lib/resolvePortalPath'
import type { NGOConfig } from '@/lib/ngoConfig'
export function usePortalAccess(config:NGOConfig){const state=usePortalAccessState();const path=usePathname()||config.handoffReturnPath;return{...state,currentPath:path,targetPath:resolvePortalPath(state.role,config),signInUrl:buildHandoffUrl(config,path)}}
