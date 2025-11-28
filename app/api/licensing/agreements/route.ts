import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      requestId,
      ipAssetId,
      creatorAddress,
      licenseeAddress,
      terms,
      contractText,
      contractHash,
      status,
      createdAt,
      expiresAt,
    } = body

    const agreement = db.createLicensingAgreement({
      id,
      requestId,
      ipAssetId,
      creatorAddress,
      licenseeAddress,
      terms,
      contractText,
      contractHash,
      status: status || 'active',
      createdAt: createdAt || Date.now(),
      expiresAt,
    })

    return NextResponse.json({ success: true, agreement })
  } catch (error) {
    console.error('Error creating licensing agreement:', error)
    return NextResponse.json(
      { error: 'Failed to create licensing agreement' },
      { status: 500 }
    )
  }
}

