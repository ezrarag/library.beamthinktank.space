import type { NGOConfig } from '@/lib/ngoConfig'

export function buildHandoffUrl(config: NGOConfig, returnPath = '/portal/member') {
  const endpoint = new URL('/onboard/handoff', `${config.beamHomeUrl.replace(/\/+$/, '')}/`)
  const siteUrl = config.siteUrl.trim()
    || (typeof window !== 'undefined' ? window.location.origin : `https://${config.slug}.beamthinktank.space`)
  const landingPageUrl = new URL(returnPath, `${siteUrl.replace(/\/+$/, '')}/`).toString()

  endpoint.searchParams.set('sourceType', 'ngo_site')
  endpoint.searchParams.set('sourceSystem', 'beam')
  endpoint.searchParams.set('organizationId', 'library')
  endpoint.searchParams.set('organizationName', config.name)
  endpoint.searchParams.set('entryChannel', `${config.slug}.beamthinktank.space`)
  endpoint.searchParams.set('returnTo', landingPageUrl)
  endpoint.searchParams.set('landingPageUrl', landingPageUrl)

  return endpoint.toString()
}
