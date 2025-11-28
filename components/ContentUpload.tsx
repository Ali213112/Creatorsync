'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useDropzone } from 'react-dropzone'
import { Upload, Loader2, CheckCircle } from 'lucide-react'
import { storyProtocol } from '@/lib/story-protocol'
import { ethers } from 'ethers'

export function ContentUpload() {
  const { address, connector } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [sdkInitialized, setSdkInitialized] = useState(false)

  // Initialize Story Protocol SDK when wallet is connected
  useEffect(() => {
    const initSDK = async () => {
      if (walletClient && address) {
        try {
          // Re-initialize SDK to ensure account is fresh
          await storyProtocol.initializeWithWallet(walletClient)
          setSdkInitialized(true)
          console.log('✅ SDK initialized and ready for transactions')
        } catch (error: any) {
          console.error('Failed to initialize Story Protocol SDK:', error)
          setSdkInitialized(false)
        }
      } else {
        setSdkInitialized(false)
      }
    }

    initSDK()
  }, [walletClient, address])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        setUploaded(false)
      }
    },
  })

  const handleUpload = async () => {
    if (!file || !address || !title) return

    if (!sdkInitialized) {
      alert('❌ Story Protocol SDK not initialized!\n\nPlease:\n1. Make sure wallet is connected\n2. Switch to Story Aeneid Testnet (Chain ID: 1315)\n3. Refresh the page')
      return
    }

    // Double-check wallet connection
    if (!walletClient) {
      alert('❌ Wallet not connected!\n\nPlease connect your wallet first.')
      return
    }

    setUploading(true)
    try {
      // 1. Analyze content with AI (via API route)
      const analysisResponse = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileType: file.type,
          fileName: file.name,
          fileSize: file.size,
          metadata: { title, description }
        })
      })
      
      if (!analysisResponse.ok) {
        throw new Error('AI analysis failed')
      }
      
      const analysisResult = await analysisResponse.json()
      setAnalysis(analysisResult)

      // 2. Generate content hash
      const fileBuffer = await file.arrayBuffer()
      const hash = ethers.keccak256(ethers.getBytes(new Uint8Array(fileBuffer)))

      // 3. Re-initialize SDK right before transaction to ensure account is fresh
      if (walletClient) {
        try {
          await storyProtocol.initializeWithWallet(walletClient)
          console.log('✅ SDK re-initialized before transaction')
        } catch (error) {
          console.warn('⚠️ SDK re-initialization warning:', error)
          // Continue anyway - might still work
        }
      }

      // 4. Register on Story Protocol (REAL BLOCKCHAIN!)
      const tokenId = await storyProtocol.registerIPAsset(
        hash,
        {
          title,
          description,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          creatorName: address.slice(0, 6),
        },
        {
          commercial: true,
          derivatives: false,
          territory: ['global'],
          duration: 365,
          price: analysisResult.suggestedPricing.commercial,
        },
        address // Pass wallet address as owner
      )

      // 5. Save to database via API
      // First, ensure creator exists
      let creatorResponse = await fetch(`/api/creators?address=${address}`)
      let creatorData = await creatorResponse.json()
      
      if (!creatorData.creator) {
        // Create creator if doesn't exist
        const newCreatorId = ethers.randomBytes(32).toString()
        const createCreatorResponse = await fetch('/api/creators', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newCreatorId,
            walletAddress: address,
            name: address.slice(0, 6),
            bio: '',
            location: '',
            language: 'en',
            createdAt: Date.now(),
          }),
        })
        creatorData = await createCreatorResponse.json()
      }

      // Create IP asset via API
      const assetId = ethers.randomBytes(32).toString()
      const createAssetResponse = await fetch('/api/ip-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: assetId,
          creatorId: creatorData.creator.id,
          tokenId,
          title,
          description,
          fileUrl: URL.createObjectURL(file), // In production, upload to IPFS or storage
          fileType: file.type,
          contentHash: hash,
          analysis: analysisResult,
          licensingTerms: {
            commercial: true,
            derivatives: false,
            territory: ['global'],
            duration: 365,
            price: analysisResult.suggestedPricing.commercial,
          },
          createdAt: Date.now(),
        }),
      })

      if (!createAssetResponse.ok) {
        throw new Error('Failed to save asset to database')
      }

      setUploaded(true)
      
      // Show success with transaction details
      alert(`✅ Content registered on blockchain!\n\nIP Asset ID: ${tokenId}\n\nCheck the console for transaction hash and explorer link.`)
    } catch (error: any) {
      console.error('Upload error:', error)
      
      // Show detailed error message
      const errorMessage = error.message || 'Upload failed. Please try again.'
      alert(`❌ Blockchain Registration Failed:\n\n${errorMessage}\n\nPlease check:\n1. Wallet is connected\n2. Wallet is on Story Aeneid Testnet (Chain ID: 1315)\n3. You have testnet IP tokens\n4. Check browser console for details`)
      
      setUploaded(false)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Upload Your Content</h2>

        {/* File Upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
            isDragActive
              ? 'border-white/50 glass-strong'
              : 'border-white/30 glass hover:border-white/40'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {file ? (
            <div>
              <p className="text-white font-semibold">{file.name}</p>
              <p className="text-gray-400 text-sm mt-2">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-white mb-2">
                Drag & drop your content here, or click to select
              </p>
              <p className="text-gray-400 text-sm">
                Supports audio, video, and image files
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        {file && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Enter content title"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                rows={4}
                placeholder="Describe your content"
              />
            </div>

            {/* AI Analysis Preview */}
            {analysis && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">AI Analysis</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white capitalize">{analysis.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality:</span>
                    <span className="text-white capitalize">{analysis.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Suggested Price:</span>
                    <span className="text-white">${analysis.suggestedPricing.commercial}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || !title || uploaded}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading & Tokenizing...
                </>
              ) : uploaded ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Uploaded Successfully!
                </>
              ) : (
                'Upload & Tokenize'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

