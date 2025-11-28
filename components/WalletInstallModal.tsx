'use client'

import { X, Download, ExternalLink } from 'lucide-react'

interface WalletInstallModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletInstallModal({ isOpen, onClose }: WalletInstallModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Install a Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-300 mb-6">
          To use CreatorSync, you need a crypto wallet like MetaMask. This allows you to:
        </p>

        <ul className="text-gray-300 mb-6 space-y-2">
          <li>• Connect to the Story Protocol blockchain</li>
          <li>• Register your IP assets</li>
          <li>• Sign transactions securely</li>
          <li>• Manage your digital assets</li>
        </ul>

        <div className="space-y-3">
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Install MetaMask
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            I'll Install Later
          </button>
        </div>

        <p className="text-gray-500 text-xs mt-4 text-center">
          After installing, refresh this page and connect your wallet.
        </p>
      </div>
    </div>
  )
}

