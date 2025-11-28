import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { aiAgent } from '@/lib/ai-agent'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ipAssetId, licenseeAddress, requestedTerms } = body

    const asset = db.getIPAsset(ipAssetId)
    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    // AI negotiation
    const negotiation = await aiAgent.negotiateTerms(
      asset.licensingTerms,
      requestedTerms,
      asset.analysis
    )

    if (negotiation.accepted) {
      // Create licensing request
      const request = db.createLicensingRequest({
        id: crypto.randomUUID(),
        ipAssetId,
        licenseeAddress,
        requestedTerms: negotiation.finalTerms,
        status: 'accepted',
        negotiationHistory: [negotiation],
        createdAt: Date.now(),
      })

      return NextResponse.json({
        success: true,
        request,
        negotiation,
      })
    }

    return NextResponse.json({
      success: false,
      negotiation,
    })
  } catch (error) {
    console.error('Error processing licensing request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

