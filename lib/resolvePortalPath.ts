import type { NGOConfig, PortalRole } from '@/lib/ngoConfig'
export interface MembershipRouting { role?:string | null }
export function normalizePortalRole(value:unknown, config:NGOConfig): PortalRole | null { if(typeof value !== 'string') return null; const role=value.trim().toLowerCase(); return config.portalRoles.includes(role as PortalRole) ? role as PortalRole : null }
export function resolvePortalPath(input:MembershipRouting|string|null|undefined, config:NGOConfig):string { const role=normalizePortalRole(typeof input === 'string' ? input : input?.role, config); return role ? `/portal/${role}` : `/portal/${config.portalRoles[0]}` }
