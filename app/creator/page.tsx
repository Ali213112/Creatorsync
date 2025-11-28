'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Upload, FileAudio, FileVideo, Image, TrendingUp, FileText } from 'lucide-react'
import { ContentUpload } from '@/components/ContentUpload'
import { CreatorDashboard } from '@/components/CreatorDashboard'
import { CreatorProfile } from '@/components/CreatorProfile'

export default function CreatorPortal() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard' | 'profile'>('dashboard')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isConnected) {
    // Check if wallet is installed
    const hasWallet = typeof window !== 'undefined' && !!(window as any).ethereum

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="glass-card rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Connect Your Wallet</h1>
            {!hasWallet ? (
              <>
                <p className="text-white/80 mb-4">You need a crypto wallet to use CreatorSync.</p>
                <p className="text-white/60 text-sm mb-6">
                  MetaMask is the most popular wallet. Install it to continue.
                </p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block glass-strong text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                >
                  Install MetaMask
                </a>
              </>
            ) : (
              <>
                <p className="text-white/80 mb-6">Please connect your wallet to access the Creator Portal</p>
                <p className="text-white/60 text-sm">Go back to the homepage and click "Connect Wallet"</p>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">Creator Portal</h1>
            <div className="text-sm text-white/80 font-medium">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/20">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-4 px-4 font-semibold transition ${
              activeTab === 'dashboard'
                ? 'text-yellow-200 border-b-2 border-yellow-200'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <TrendingUp className="inline w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-4 px-4 font-semibold transition ${
              activeTab === 'upload'
                ? 'text-yellow-200 border-b-2 border-yellow-200'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Upload className="inline w-4 h-4 mr-2" />
            Upload Content
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-4 font-semibold transition ${
              activeTab === 'profile'
                ? 'text-yellow-200 border-b-2 border-yellow-200'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <FileText className="inline w-4 h-4 mr-2" />
            Profile
          </button>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && <CreatorDashboard />}
        {activeTab === 'upload' && <ContentUpload />}
        {activeTab === 'profile' && <CreatorProfile />}
      </div>
    </div>
  )
}

