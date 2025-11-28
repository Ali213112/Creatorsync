import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const creator = db.getCreatorByAddress(params.address)
    if (!creator) {
      return NextResponse.json({ assets: [] })
    }

    const assets = db.getIPAssetsByCreator(creator.id)
    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Error fetching creator assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

