import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      ipAssetId,
      licenseeAddress,
      requestedTerms,
      status,
      negotiationHistory,
      createdAt,
    } = body

    const licensingRequest = db.createLicensingRequest({
      id,
      ipAssetId,
      licenseeAddress,
      requestedTerms,
      status: status || 'pending',
      negotiationHistory: negotiationHistory || [],
      createdAt: createdAt || Date.now(),
    })

    return NextResponse.json({ success: true, request: licensingRequest })
  } catch (error) {
    console.error('Error creating licensing request:', error)
    return NextResponse.json(
      { error: 'Failed to create licensing request' },
      { status: 500 }
    )
  }
}

