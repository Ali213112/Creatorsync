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

    // Ensure creator exists
    const creator = db.getCreator(creatorId)
    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      )
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

    return NextResponse.json({ success: true, asset })
  } catch (error) {
    console.error('Error creating IP asset:', error)
    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 }
    )
  }
}

