export type LibraryItemMedium =
  | 'photography'
  | 'craft'
  | 'textile'
  | 'writing'
  | 'music'
  | 'video'
  | 'mixed'
  | 'other'

export type LibraryItemStatus = 'SUBMITTED' | 'CATALOGED' | 'DIGITIZED' | 'DISPLAYED' | 'ARCHIVED'

export interface MarketplaceListing {
  status: 'none' | 'planned' | 'listed'
  priceUsd?: number
  subscription?: boolean
  externalUrl?: string
  notes?: string
}

export interface LibraryItem {
  id: string
  title: string
  creatorName: string
  accountHolderUid: string
  medium: LibraryItemMedium
  story: string
  regionId: string
  status: LibraryItemStatus
  mediaUrls: string[]
  teachingOffer?: string
  marketplace: MarketplaceListing
  createdAt: string
  updatedAt: string
}
