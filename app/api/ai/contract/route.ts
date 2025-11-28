import { NextRequest, NextResponse } from 'next/server'
import { aiAgent } from '@/lib/ai-agent'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { terms, creatorInfo, licenseeInfo, contentInfo, language } = body

    const contract = await aiAgent.generateContract(
      terms,
      creatorInfo,
      licenseeInfo,
      contentInfo,
      language
    )
    
    return NextResponse.json({ contract })
  } catch (error: any) {
    console.error('AI Contract API error:', error)
    return NextResponse.json(
      { error: error.message || 'Contract generation failed' },
      { status: 500 }
    )
  }
}

