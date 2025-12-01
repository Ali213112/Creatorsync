import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const creatorId = searchParams.get('creatorId')

    if (creatorId) {
      const assets = db.getIPAssetsByCreator(creatorId)
      return NextResponse.json({ assets })
    }

    const assets = db.getAllIPAssets()
    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Error fetching IP assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Creating IP asset:', { body })
    
    const {
      id,
      creatorId,
      tokenId,
      title,
      description,
      fileUrl,
      fileType,
      contentHash,
      analysis,
      licensingTerms,
      createdAt,
    } = body

    // Ensure creator exists - if not, create a basic one
    let creator = db.getCreator(creatorId)
    if (!creator) {
      console.log('⚠️ Creator not found, creating basic creator:', creatorId)
      // Create a basic creator if it doesn't exist
      creator = db.createCreator({
        id: creatorId,
        walletAddress: creatorId, // Use creatorId as wallet address
        name: 'Unknown Creator',
        bio: '',
        location: '',
        language: 'en',
        createdAt: Date.now(),
      })
    }

    const asset = db.createIPAsset({
      id,
      creatorId,
      tokenId,
      title,
      description: description || '',
      fileUrl,
      fileType,
      contentHash,
      analysis,
      licensingTerms,
      createdAt: createdAt || Date.now(),
    })

    console.log('✅ IP asset created successfully:', asset.id)
    return NextResponse.json({ success: true, asset })
  } catch (error: any) {
    console.error('❌ Error creating IP asset:', error)
    return NextResponse.json(
      { error: 'Failed to create asset', details: error.message },
      { status: 500 }
    )
  }
}

