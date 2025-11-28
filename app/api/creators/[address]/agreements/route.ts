import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const agreements = db.getLicensingAgreementsByCreator(params.address)
    return NextResponse.json({ agreements })
  } catch (error) {
    console.error('Error fetching creator agreements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agreements' },
      { status: 500 }
    )
  }
}

