'use client'
import { useEffect } from 'react'; import { useRouter } from 'next/navigation'; import { usePortalAccess } from '@/lib/usePortalAccess'; import type { NGOConfig } from '@/lib/ngoConfig'
export function PortalDashboardRouter({config}:{config:NGOConfig}){const router=useRouter();const access=usePortalAccess(config);useEffect(()=>{if(access.status==='authenticated')router.replace(access.targetPath)},[access.status,access.targetPath,router]);return <div className="page"><section className="surface-panel p-8">Resolving your Library workspace...</section></div>}
