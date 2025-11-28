import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get('address')

    if (address) {
      const creator = db.getCreatorByAddress(address)
      if (!creator) {
        return NextResponse.json({ creator: null })
      }
      return NextResponse.json({ creator })
    }

    return NextResponse.json({ error: 'Address parameter required' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching creator:', error)
    return NextResponse.json(
      { error: 'Failed to fetch creator' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, walletAddress, name, bio, location, language, createdAt } = body

    const creator = db.createCreator({
      id,
      walletAddress,
      name,
      bio: bio || '',
      location: location || '',
      language: language || 'en',
      createdAt: createdAt || Date.now(),
    })

    return NextResponse.json({ creator })
  } catch (error) {
    console.error('Error creating creator:', error)
    return NextResponse.json(
      { error: 'Failed to create creator' },
      { status: 500 }
    )
  }
}

