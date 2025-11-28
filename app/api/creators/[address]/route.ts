import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const param = params.address
    
    // Try to get by ID first (if it looks like a UUID/hex string)
    // Otherwise, treat it as an address
    let creator = db.getCreator(param)
    
    // If not found by ID, try by address
    if (!creator) {
      creator = db.getCreatorByAddress(param)
    }
    
    if (!creator) {
      return NextResponse.json({ creator: null })
    }
    return NextResponse.json({ creator })
  } catch (error) {
    console.error('Error fetching creator:', error)
    return NextResponse.json(
      { error: 'Failed to fetch creator' },
      { status: 500 }
    )
  }
}

