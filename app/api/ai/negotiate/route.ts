import { NextRequest, NextResponse } from 'next/server'
import { aiAgent } from '@/lib/ai-agent'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { creatorTerms, licenseeRequest, contentAnalysis } = body

    const result = await aiAgent.negotiateTerms(creatorTerms, licenseeRequest, contentAnalysis)
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('AI Negotiation API error:', error)
    return NextResponse.json(
      { error: error.message || 'AI negotiation failed' },
      { status: 500 }
    )
  }
}

