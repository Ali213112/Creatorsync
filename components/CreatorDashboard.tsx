'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { FileText, DollarSign, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export function CreatorDashboard() {
  const { address } = useAccount()
  const [assets, setAssets] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalRevenue: 0,
    activeLicenses: 0,
    pendingRequests: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!address) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        // Fetch creator first to get creatorId
        const creatorResponse = await fetch(`/api/creators?address=${address}`)
        if (!creatorResponse.ok) {
          setLoading(false)
          return
        }
        const creatorData = await creatorResponse.json()
        if (!creatorData.creator) {
          setLoading(false)
          return
        }

        // Fetch all data in parallel
        const [assetsResponse, requestsResponse, agreementsResponse] = await Promise.all([
          fetch(`/api/creators/${address}/assets`),
          fetch(`/api/creators/${address}/requests`),
          fetch(`/api/creators/${address}/agreements`),
        ])

        const assetsData = await assetsResponse.json()
        const requestsData = await requestsResponse.json()
        const agreementsData = await agreementsResponse.json()

        setAssets(assetsData.assets || [])
        setRequests(requestsData.requests || [])

        const agreements = agreementsData.agreements || []
        const totalRevenue = agreements.reduce((sum: number, a: any) => sum + a.terms.price, 0)
        const activeLicenses = agreements.filter(
          (a: any) => a.status === 'active' && a.expiresAt > Date.now()
        ).length

        setStats({
          totalAssets: (assetsData.assets || []).length,
          totalRevenue,
          activeLicenses,
          pendingRequests: (requestsData.requests || []).filter((r: any) => r.status === 'pending').length,
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [address])

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Assets</span>
            <FileText className="w-5 h-5 text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalAssets}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-white">${stats.totalRevenue}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Licenses</span>
            <TrendingUp className="w-5 h-5 text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.activeLicenses}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Pending Requests</span>
            <Clock className="w-5 h-5 text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.pendingRequests}</p>
        </div>
      </div>

      {/* Recent Assets */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Your IP Assets</h2>
        {assets.length === 0 ? (
          <p className="text-gray-400">No assets uploaded yet. Upload your first content!</p>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-white font-semibold">{asset.title}</h3>
                  <p className="text-gray-400 text-sm">{asset.description}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Price: ${asset.licensingTerms.price} | Type: {asset.fileType}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-primary-400 text-sm font-semibold">
                    Token ID: {asset.tokenId.slice(0, 8)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Licensing Requests */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Licensing Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-400">No licensing requests yet.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-semibold">
                      Request from {request.licenseeAddress.slice(0, 6)}...
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Status: <span className="capitalize">{request.status}</span>
                    </p>
                  </div>
                  <span className="bg-primary-600 text-white px-3 py-1 rounded text-sm">
                    ${request.requestedTerms.price}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">
                  <p>Usage: {request.requestedTerms.usageRights}</p>
                  <p>Duration: {request.requestedTerms.duration} days</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

