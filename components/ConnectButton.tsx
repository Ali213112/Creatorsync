'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Download, ExternalLink } from 'lucide-react'

export function ConnectButton() {
  const [mounted, setMounted] = useState(false)
  const [hasWallet, setHasWallet] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Check if wallet is installed
  useEffect(() => {
    setMounted(true)
    
    // Check if MetaMask or other wallet is installed
    if (typeof window !== 'undefined') {
      const ethereum = (window as any).ethereum
      setHasWallet(!!ethereum)
    }
  }, [])

  if (!mounted) {
    return (
      <button
        className="glass-strong text-white px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300"
        disabled
      >
        Connect Wallet
      </button>
    )
  }

  // If wallet is not installed, show install message
  if (!hasWallet) {
    return (
      <div className="relative group">
        <button
          onClick={() => {
            window.open('https://metamask.io/download/', '_blank')
          }}
          className="glass-strong text-white px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Install MetaMask
        </button>
        <div className="absolute top-full mt-2 right-0 glass-card text-white p-4 rounded-xl shadow-2xl w-64 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <p className="text-sm mb-2">You need a crypto wallet to use CreatorSync.</p>
          <p className="text-xs text-white/70 mb-3">MetaMask is the most popular wallet.</p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xs hover:underline flex items-center gap-1"
          >
            Install MetaMask <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-white text-sm font-medium drop-shadow-lg">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="glass text-white px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 hover:bg-white/20"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        if (connectors.length > 0) {
          connect({ connector: connectors[0] })
        } else {
          alert('No wallet connector found. Please install MetaMask.')
        }
      }}
      className="glass-strong text-white px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      Connect Wallet
    </button>
  )
}

