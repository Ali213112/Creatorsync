'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { X, Loader2 } from 'lucide-react'
import { storyProtocol } from '@/lib/story-protocol'
import { ethers } from 'ethers'

interface RequestLicenseModalProps {
  asset: any
  onClose: () => void
}

export function RequestLicenseModal({ asset, onClose }: RequestLicenseModalProps) {
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  const [requestedTerms, setRequestedTerms] = useState({
    usageRights: 'commercial' as 'commercial' | 'non-commercial' | 'exclusive',
    price: asset.licensingTerms.price,
    duration: 365,
    territory: ['global'],
  })
  const [negotiationResult, setNegotiationResult] = useState<any>(null)

  const handleRequest = async () => {
    if (!address) {
      alert('Please connect your wallet')
      return
    }

    setLoading(true)
    try {
      // 1. AI Agent negotiates terms (via API route)
      const negotiateResponse = await fetch('/api/ai/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorTerms: asset.licensingTerms,
          licenseeRequest: requestedTerms,
          contentAnalysis: asset.analysis
        })
      })
      
      if (!negotiateResponse.ok) {
        throw new Error('AI negotiation failed')
      }
      
      const negotiation = await negotiateResponse.json()

      setNegotiationResult(negotiation)

      if (negotiation.accepted) {
        // 2. Get creator info via API
        const creatorResponse = await fetch(`/api/creators/${asset.creatorId}`)
        const creatorData = await creatorResponse.json()
        const creator = creatorData.creator
        const creatorAddress = creator?.walletAddress || asset.creatorId

        // 3. Create licensing request via API
        const requestId = ethers.randomBytes(32).toString()
        const createRequestResponse = await fetch('/api/licensing/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: requestId,
            ipAssetId: asset.id,
            licenseeAddress: address,
            requestedTerms: negotiation.finalTerms,
            status: 'accepted',
            negotiationHistory: [negotiation],
            createdAt: Date.now(),
          }),
        })

        if (!createRequestResponse.ok) {
          throw new Error('Failed to create licensing request')
        }

        // 4. Generate contract (via API route)
        const contractResponse = await fetch('/api/ai/contract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            terms: negotiation.finalTerms,
            creatorInfo: {
              name: creator?.name || 'Unknown',
              address: creatorAddress,
            },
            licenseeInfo: {
              name: address.slice(0, 6),
              address: address,
            },
            contentInfo: {
              title: asset.title,
              tokenId: asset.tokenId,
            },
            language: creator?.language || 'en'
          })
        })
        
        if (!contractResponse.ok) {
          throw new Error('Contract generation failed')
        }
        
        const contractData = await contractResponse.json()
        const contractText = contractData.contract

        // 5. Create agreement on Story Protocol
        const agreementId = await storyProtocol.createLicensingAgreement(
          asset.tokenId,
          address,
          negotiation.finalTerms
        )

        // 6. Save agreement via API
        const agreementIdStr = ethers.randomBytes(32).toString()
        const createAgreementResponse = await fetch('/api/licensing/agreements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: agreementIdStr,
            requestId: requestId,
            ipAssetId: asset.id,
            creatorAddress: creatorAddress,
            licenseeAddress: address,
            terms: negotiation.finalTerms,
            contractText,
            contractHash: ethers.keccak256(ethers.toUtf8Bytes(contractText)),
            status: 'active',
            createdAt: Date.now(),
            expiresAt: Date.now() + negotiation.finalTerms.duration * 24 * 60 * 60 * 1000,
          }),
        })

        if (!createAgreementResponse.ok) {
          throw new Error('Failed to create agreement')
        }

        alert('License request accepted! Contract generated.')
        onClose()
      } else {
        alert('Negotiation failed. Please adjust your terms.')
      }
    } catch (error) {
      console.error('Request error:', error)
      alert('Failed to process request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Request License</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Asset Info */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">{asset.title}</h3>
            <p className="text-gray-400 text-sm">{asset.description}</p>
            <p className="text-gray-500 text-xs mt-2">
              Creator Price: ${asset.licensingTerms.price}
            </p>
          </div>

          {/* Requested Terms */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Requested Terms</h3>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Usage Rights</label>
              <select
                value={requestedTerms.usageRights}
                onChange={(e) =>
                  setRequestedTerms({
                    ...requestedTerms,
                    usageRights: e.target.value as any,
                  })
                }
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="commercial">Commercial</option>
                <option value="non-commercial">Non-Commercial</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Price (USD)</label>
              <input
                type="number"
                value={requestedTerms.price}
                onChange={(e) =>
                  setRequestedTerms({
                    ...requestedTerms,
                    price: parseInt(e.target.value),
                  })
                }
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Duration (days)</label>
              <input
                type="number"
                value={requestedTerms.duration}
                onChange={(e) =>
                  setRequestedTerms({
                    ...requestedTerms,
                    duration: parseInt(e.target.value),
                  })
                }
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>

          {/* Negotiation Result */}
          {negotiationResult && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">AI Negotiation Result</h3>
              <p
                className={`mb-2 ${
                  negotiationResult.accepted ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {negotiationResult.accepted ? 'Accepted' : 'Rejected'}
              </p>
              <p className="text-gray-400 text-sm">{negotiationResult.reasoning}</p>
              {negotiationResult.accepted && (
                <div className="mt-4 text-sm text-gray-300">
                  <p>Final Price: ${negotiationResult.finalTerms.price}</p>
                  <p>Duration: {negotiationResult.finalTerms.duration} days</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRequest}
              disabled={loading}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Request License'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

