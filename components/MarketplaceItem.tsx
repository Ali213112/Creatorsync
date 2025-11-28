'use client'

import { Music, Video, Image as ImageIcon, DollarSign } from 'lucide-react'

interface MarketplaceItemProps {
  asset: any
  onRequestLicense: () => void
}

export function MarketplaceItem({ asset, onRequestLicense }: MarketplaceItemProps) {
  const getIcon = () => {
    if (asset.fileType.startsWith('audio/')) return <Music className="w-8 h-8" />
    if (asset.fileType.startsWith('video/')) return <Video className="w-8 h-8" />
    return <ImageIcon className="w-8 h-8" />
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="text-primary-400">{getIcon()}</div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-primary-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-xl font-bold">{asset.licensingTerms.price}</span>
          </div>
        </div>
      </div>

      <h3 className="text-white font-semibold text-lg mb-2">{asset.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{asset.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>Type: {asset.fileType.split('/')[0]}</span>
        <span>Quality: {asset.analysis?.quality || 'N/A'}</span>
      </div>

      <button
        onClick={onRequestLicense}
        className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
      >
        Request License
      </button>
    </div>
  )
}

