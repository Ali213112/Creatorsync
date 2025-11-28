import { NextRequest, NextResponse } from 'next/server'
import { aiAgent } from '@/lib/ai-agent'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileType, fileName, metadata, fileSize } = body

    const analysis = await aiAgent.analyzeContent(fileType, fileName, metadata, fileSize)
    
    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('AI Analysis API error:', error)
    return NextResponse.json(
      { error: error.message || 'AI analysis failed' },
      { status: 500 }
    )
  }
}

