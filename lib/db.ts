// Simple in-memory database for MVP
// In production, replace with actual database (PostgreSQL, MongoDB, etc.)

export interface Creator {
  id: string
  walletAddress: string
  name: string
  bio: string
  location: string
  language: string
  createdAt: number
}

export interface IPAsset {
  id: string
  creatorId: string
  tokenId: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  contentHash: string
  analysis: any
  licensingTerms: {
    commercial: boolean
    derivatives: boolean
    territory: string[]
    duration: number
    price: number
  }
  createdAt: number
}

export interface LicensingRequest {
  id: string
  ipAssetId: string
  licenseeAddress: string
  requestedTerms: {
    usageRights: string
    price: number
    duration: number
    territory: string[]
  }
  status: 'pending' | 'negotiating' | 'accepted' | 'rejected'
  negotiationHistory: any[]
  createdAt: number
}

export interface LicensingAgreement {
  id: string
  requestId: string
  ipAssetId: string
  creatorAddress: string
  licenseeAddress: string
  terms: {
    usageRights: string
    price: number
    duration: number
    territory: string[]
  }
  contractText: string
  contractHash: string
  status: 'active' | 'expired' | 'cancelled'
  createdAt: number
  expiresAt: number
}

class Database {
  private creators: Map<string, Creator> = new Map()
  private ipAssets: Map<string, IPAsset> = new Map()
  private licensingRequests: Map<string, LicensingRequest> = new Map()
  private licensingAgreements: Map<string, LicensingAgreement> = new Map()

  // Creators
  createCreator(creator: Creator): Creator {
    this.creators.set(creator.id, creator)
    return creator
  }

  getCreator(id: string): Creator | undefined {
    return this.creators.get(id)
  }

  getCreatorByAddress(address: string): Creator | undefined {
    return Array.from(this.creators.values()).find(
      (c) => c.walletAddress.toLowerCase() === address.toLowerCase()
    )
  }

  // IP Assets
  createIPAsset(asset: IPAsset): IPAsset {
    this.ipAssets.set(asset.id, asset)
    return asset
  }

  getIPAsset(id: string): IPAsset | undefined {
    return this.ipAssets.get(id)
  }

  getIPAssetsByCreator(creatorId: string): IPAsset[] {
    return Array.from(this.ipAssets.values()).filter(
      (a) => a.creatorId === creatorId
    )
  }

  getAllIPAssets(): IPAsset[] {
    return Array.from(this.ipAssets.values())
  }

  // Licensing Requests
  createLicensingRequest(request: LicensingRequest): LicensingRequest {
    this.licensingRequests.set(request.id, request)
    return request
  }

  getLicensingRequest(id: string): LicensingRequest | undefined {
    return this.licensingRequests.get(id)
  }

  getLicensingRequestsByCreator(creatorId: string): LicensingRequest[] {
    const creatorAssets = this.getIPAssetsByCreator(creatorId)
    const assetIds = new Set(creatorAssets.map((a) => a.id))
    return Array.from(this.licensingRequests.values()).filter((r) =>
      assetIds.has(r.ipAssetId)
    )
  }

  updateLicensingRequest(
    id: string,
    updates: Partial<LicensingRequest>
  ): LicensingRequest | undefined {
    const request = this.licensingRequests.get(id)
    if (!request) return undefined

    const updated = { ...request, ...updates }
    this.licensingRequests.set(id, updated)
    return updated
  }

  // Licensing Agreements
  createLicensingAgreement(agreement: LicensingAgreement): LicensingAgreement {
    this.licensingAgreements.set(agreement.id, agreement)
    return agreement
  }

  getLicensingAgreement(id: string): LicensingAgreement | undefined {
    return this.licensingAgreements.get(id)
  }

  getLicensingAgreementsByCreator(creatorAddress: string): LicensingAgreement[] {
    return Array.from(this.licensingAgreements.values()).filter(
      (a) => a.creatorAddress.toLowerCase() === creatorAddress.toLowerCase()
    )
  }
}

export const db = new Database()

