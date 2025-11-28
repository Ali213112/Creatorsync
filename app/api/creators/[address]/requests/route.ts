import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const creator = db.getCreatorByAddress(params.address)
    if (!creator) {
      return NextResponse.json({ requests: [] })
    }

    const requests = db.getLicensingRequestsByCreator(creator.id)
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Error fetching creator requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}

