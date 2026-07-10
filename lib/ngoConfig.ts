export type PortalRole = 'member' | 'curator' | 'partner' | 'civic'
export interface NGOConfig { slug:string; name:string; siteUrl:string; description:string; primaryColor:string; portalRoles:PortalRole[]; beamHomeUrl:string; handoffReturnPath:string }
export const libraryConfig: NGOConfig = {
  slug:'library', name:'BEAM Library', siteUrl:process.env.NEXT_PUBLIC_SITE_URL?.trim() || '',
  description:'A culturally specific repository, archival training ground, and bridge between community creators and the marketplace.',
  primaryColor:'#d7b56d', portalRoles:['member','curator','partner','civic'],
  beamHomeUrl:process.env.NEXT_PUBLIC_BEAM_HOME_URL?.trim() || 'https://www.beamthinktank.space', handoffReturnPath:'/portal',
}
