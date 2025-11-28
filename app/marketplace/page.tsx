'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Music, Video, Image as ImageIcon } from 'lucide-react'
import { MarketplaceItem } from '@/components/MarketplaceItem'
import { RequestLicenseModal } from '@/components/RequestLicenseModal'

export default function Marketplace() {
  const [assets, setAssets] = useState<any[]>([])
  const [filteredAssets, setFilteredAssets] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [contentType, setContentType] = useState<'all' | 'music' | 'video' | 'image'>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch assets from API (server-side only)
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/ip-assets')
        if (!response.ok) throw new Error('Failed to fetch assets')
        const data = await response.json()
        setAssets(data.assets || [])
        setFilteredAssets(data.assets || [])
      } catch (error) {
        console.error('Error fetching assets:', error)
        setAssets([])
        setFilteredAssets([])
      } finally {
        setLoading(false)
      }
    }
    fetchAssets()
  }, [])

  useEffect(() => {
    let filtered = assets

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (asset) =>
          asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Content type filter
    if (contentType !== 'all') {
      filtered = filtered.filter((asset) => {
        if (contentType === 'music') return asset.fileType.startsWith('audio/')
        if (contentType === 'video') return asset.fileType.startsWith('video/')
        if (contentType === 'image') return asset.fileType.startsWith('image/')
        return true
      })
    }

    // Price range filter
    filtered = filtered.filter(
      (asset) =>
        asset.licensingTerms.price >= priceRange[0] &&
        asset.licensingTerms.price <= priceRange[1]
    )

    setFilteredAssets(filtered)
  }, [searchQuery, contentType, priceRange, assets])

  return (
    <div className="min-h-screen">
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">Licensing Marketplace</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="w-full glass text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20"
              />
            </div>

            {/* Content Type */}
            <div>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as any)}
                className="w-full glass text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20"
              >
                <option value="all">All Types</option>
                <option value="music">Music</option>
                <option value="video">Video</option>
                <option value="image">Images</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-white/80 font-medium">
          Found {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}
        </div>

        {/* Asset Grid */}
        {filteredAssets.length === 0 ? (
          <div className="text-center py-20">
            <div className="glass-card rounded-2xl p-8 inline-block">
              <p className="text-white text-xl mb-2">No assets found</p>
              <p className="text-white/70 mt-2">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <MarketplaceItem
                key={asset.id}
                asset={asset}
                onRequestLicense={() => setSelectedAsset(asset)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Request License Modal */}
      {selectedAsset && (
        <RequestLicenseModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  )
}

