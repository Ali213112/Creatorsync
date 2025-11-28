import OpenAI from 'openai'
import { HfInference } from '@huggingface/inference'

// Initialize AI providers
// Check both regular and NEXT_PUBLIC_ prefixed env vars
const openaiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
const hfKey = process.env.HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY

const openai = openaiKey
  ? new OpenAI({ apiKey: openaiKey })
  : null

const hf = hfKey
  ? new HfInference(hfKey)
  : null

// Log initialization status (without exposing keys)
if (hf) {
  console.log('✅ Hugging Face AI initialized')
} else {
  console.warn('⚠️ Hugging Face API key not found. Set HUGGINGFACE_API_KEY in .env.local')
}

if (openai) {
  console.log('✅ OpenAI AI initialized')
}

// Helper function to call AI
async function callAI(prompt: string, jsonMode: boolean = false): Promise<string> {
  // Try Hugging Face first (free, no credit card)
  if (hf) {
    try {
      // Use a good free model
      const model = jsonMode 
        ? 'mistralai/Mistral-7B-Instruct-v0.2'
        : 'mistralai/Mistral-7B-Instruct-v0.2'
      
      const response = await hf.textGeneration({
        model: model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 2000, // Increased for more detailed analysis
          return_full_text: false,
          temperature: 0.5, // Lower temperature for more consistent, focused responses
        },
      })
      
      let text = response.generated_text || ''
      
      // If JSON mode, try to extract JSON from response
      if (jsonMode && text) {
        // Try to find JSON in the response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          text = jsonMatch[0]
        }
      }
      
      return text
    } catch (error) {
      console.log('Hugging Face error, trying OpenAI...', error)
    }
  }

  // Fallback to OpenAI if available
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Cheaper model
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert IP licensing analyst. Provide detailed, accurate, and fair analysis. Always return valid JSON when requested.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5, // Lower temperature for more consistent responses
        max_tokens: 2000, // Increased for more detailed responses
        ...(jsonMode && { response_format: { type: 'json_object' } }),
      })
      return response.choices[0].message.content || ''
    } catch (error) {
      console.error('OpenAI error:', error)
    }
  }

  // If no AI available, return empty
  throw new Error('No AI API key configured. Please add HUGGINGFACE_API_KEY or OPENAI_API_KEY to .env.local')
}

export interface ContentAnalysis {
  type: 'music' | 'video' | 'image' | 'other'
  quality: 'low' | 'medium' | 'high' | 'professional'
  duration?: number // in seconds
  genre?: string
  estimatedValue: number // in USD
  suggestedPricing: {
    commercial: number
    nonCommercial: number
    exclusive: number
  }
  tags: string[]
}

export interface LicensingTerms {
  usageRights: 'commercial' | 'non-commercial' | 'exclusive'
  derivatives: boolean
  territory: string[]
  duration: number // in days
  price: number
}

export interface NegotiationResult {
  accepted: boolean
  finalTerms: LicensingTerms
  reasoning: string
}

export class AIAgent {
  /**
   * Analyzes uploaded content and suggests pricing
   */
  async analyzeContent(
    fileType: string,
    fileName: string,
    metadata?: Record<string, any>,
    fileSize?: number
  ): Promise<ContentAnalysis> {
    const title = metadata?.title || ''
    const description = metadata?.description || ''
    
    const prompt = `You are an expert IP licensing analyst with deep knowledge of content market values, quality assessment, and fair pricing strategies.

Analyze this content for IP licensing with careful consideration:

FILE INFORMATION:
- File Type: ${fileType}
- File Name: ${fileName}
- File Size: ${fileSize ? `${(fileSize / 1024 / 1024).toFixed(2)} MB` : 'unknown'}
- Title: ${title || 'Not provided'}
- Description: ${description || 'Not provided'}

ANALYSIS REQUIREMENTS:
1. CONTENT TYPE: Determine if this is music/video/image/other based on file type and metadata
2. QUALITY ASSESSMENT: Evaluate quality as low/medium/high/professional based on:
   - File name patterns (screenshots, low-res, compressed files suggest lower quality)
   - File size relative to type (very small files may be low quality)
   - Title and description quality (professional content has better descriptions)
   - Common indicators of low quality: "screenshot", "copy", "temp", "low-res", "compressed"
3. MARKET VALUE: Estimate realistic market value considering:
   - Content type and quality level
   - Industry standards for similar content
   - Low quality content (screenshots, quick snaps) = $5-50
   - Medium quality (decent photos, basic videos) = $50-500
   - High quality (professional work) = $500-5000
   - Professional/exceptional = $5000+
4. PRICING STRATEGY: Set fair, market-appropriate pricing:
   - Commercial license: Based on quality and market value (typically 1-2x estimated value)
   - Non-commercial: Lower than commercial (typically 20-50% of commercial)
   - Exclusive: Significantly higher (typically 5-10x commercial for high quality, 2-3x for lower quality)
   - Be realistic: Low quality content should NOT be priced at $500+
5. TAGS: Generate relevant tags for discoverability

CRITICAL RULES:
- Low quality content (screenshots, quick photos, basic images) should have commercial pricing of $10-100, NOT $500+
- Only professional, high-quality content should command premium pricing ($500+)
- Consider file size: Very small files often indicate low quality
- File names with "screenshot", "copy", "temp" suggest lower value
- Be conservative and realistic with pricing

Return ONLY valid JSON in this exact format:
{
  "type": "music|video|image|other",
  "quality": "low|medium|high|professional",
  "duration": number (in seconds, only for audio/video),
  "genre": "string or null",
  "estimatedValue": number (realistic USD value),
  "suggestedPricing": {
    "commercial": number (fair commercial price in USD),
    "nonCommercial": number (fair non-commercial price in USD),
    "exclusive": number (fair exclusive price in USD)
  },
  "tags": ["tag1", "tag2", "tag3"]
}

Return only the JSON object, no other text.`

    try {
      const response = await callAI(prompt, true)
      let analysis: any = {}
      
      // Try to parse JSON response
      try {
        analysis = JSON.parse(response || '{}')
      } catch (parseError) {
        // If direct parse fails, try to extract JSON from text
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0])
        }
      }

      // Determine quality-based fallback pricing
      const quality = analysis.quality || 'medium'
      const getQualityBasedPricing = (q: string) => {
        switch (q.toLowerCase()) {
          case 'low':
            return { commercial: 25, nonCommercial: 10, exclusive: 100 }
          case 'medium':
            return { commercial: 150, nonCommercial: 50, exclusive: 1000 }
          case 'high':
            return { commercial: 500, nonCommercial: 150, exclusive: 3000 }
          case 'professional':
            return { commercial: 2000, nonCommercial: 500, exclusive: 10000 }
          default:
            return { commercial: 150, nonCommercial: 50, exclusive: 1000 }
        }
      }

      const qualityPricing = getQualityBasedPricing(quality)
      
      return {
        type: analysis.type || (fileType.includes('audio') ? 'music' : fileType.includes('video') ? 'video' : fileType.includes('image') ? 'image' : 'other'),
        quality: quality,
        duration: analysis.duration,
        genre: analysis.genre,
        estimatedValue: analysis.estimatedValue || (quality === 'low' ? 20 : quality === 'medium' ? 100 : quality === 'high' ? 500 : 2000),
        suggestedPricing: {
          commercial: analysis.suggestedPricing?.commercial || qualityPricing.commercial,
          nonCommercial: analysis.suggestedPricing?.nonCommercial || qualityPricing.nonCommercial,
          exclusive: analysis.suggestedPricing?.exclusive || qualityPricing.exclusive,
        },
        tags: Array.isArray(analysis.tags) ? analysis.tags : [],
      }
    } catch (error) {
      console.error('AI Analysis error:', error)
      
      // Smart fallback based on file characteristics
      const fileNameLower = fileName.toLowerCase()
      const isLowQuality = fileNameLower.includes('screenshot') || 
                          fileNameLower.includes('copy') || 
                          fileNameLower.includes('temp') ||
                          fileNameLower.includes('low-res') ||
                          (fileSize && fileSize < 100000) // Less than 100KB
      
      const fallbackQuality = isLowQuality ? 'low' : 'medium'
      const fallbackPricing = isLowQuality 
        ? { commercial: 25, nonCommercial: 10, exclusive: 100 }
        : { commercial: 150, nonCommercial: 50, exclusive: 1000 }
      
      return {
        type: fileType.includes('audio') ? 'music' : fileType.includes('video') ? 'video' : fileType.includes('image') ? 'image' : 'other',
        quality: fallbackQuality,
        estimatedValue: isLowQuality ? 20 : 100,
        suggestedPricing: fallbackPricing,
        tags: [],
      }
    }
  }

  /**
   * Negotiates licensing terms between creator and licensee
   */
  async negotiateTerms(
    creatorTerms: LicensingTerms,
    licenseeRequest: Partial<LicensingTerms>,
    contentAnalysis: ContentAnalysis
  ): Promise<NegotiationResult> {
    const prompt = `You are an expert IP licensing negotiator. Your role is to facilitate fair agreements between content creators and licensees.

CURRENT SITUATION:
Creator's Initial Terms:
- Usage Rights: ${creatorTerms.usageRights}
- Price: $${creatorTerms.price}
- Duration: ${creatorTerms.duration} days
- Territory: ${creatorTerms.territory.join(', ')}
- Derivatives Allowed: ${creatorTerms.derivatives}

Licensee's Request:
- Usage Rights: ${licenseeRequest.usageRights || 'not specified'}
- Price: $${licenseeRequest.price || 'not specified'}
- Duration: ${licenseeRequest.duration || 'not specified'} days
- Territory: ${licenseeRequest.territory?.join(', ') || 'not specified'}

Content Analysis:
- Type: ${contentAnalysis.type}
- Quality: ${contentAnalysis.quality}
- Estimated Market Value: $${contentAnalysis.estimatedValue}
- Suggested Commercial Price: $${contentAnalysis.suggestedPricing.commercial}
- Suggested Non-Commercial Price: $${contentAnalysis.suggestedPricing.nonCommercial}
- Suggested Exclusive Price: $${contentAnalysis.suggestedPricing.exclusive}

NEGOTIATION GUIDELINES:
1. Consider the content quality and market value when evaluating price requests
2. Allow reasonable price negotiations (within 20-30% of original price is usually acceptable)
3. If licensee requests significantly lower price, suggest a middle ground
4. Consider usage rights: exclusive should cost more than commercial, commercial more than non-commercial
5. Be fair to both parties - don't always favor the creator or licensee
6. If terms are reasonable, accept them. If unreasonable, suggest fair alternatives.

DECISION LOGIC:
- Accept if: Price difference is within 30% and usage rights are compatible
- Negotiate if: Price difference is 30-50% - suggest a middle ground
- Reject if: Price difference is >50% or terms are fundamentally incompatible

Return JSON in this exact format:
{
  "accepted": boolean,
  "finalTerms": {
    "usageRights": "commercial|non-commercial|exclusive",
    "price": number,
    "duration": number,
    "territory": ["string"],
    "derivatives": boolean
  },
  "reasoning": "clear explanation of the negotiation outcome and why"
}

Return only the JSON object, no other text.`

    try {
      const response = await callAI(prompt, true)
      let result: any = {}
      
      // Try to parse JSON response
      try {
        result = JSON.parse(response || '{}')
      } catch (parseError) {
        // If direct parse fails, try to extract JSON from text
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0])
        }
      }

      // Validate and construct final terms
      const finalTerms: LicensingTerms = result.finalTerms || {
        usageRights: creatorTerms.usageRights,
        price: creatorTerms.price,
        duration: creatorTerms.duration,
        territory: creatorTerms.territory,
        derivatives: creatorTerms.derivatives,
      }

      // Ensure finalTerms has all required fields
      if (result.finalTerms) {
        finalTerms.usageRights = result.finalTerms.usageRights || creatorTerms.usageRights
        finalTerms.price = result.finalTerms.price ?? creatorTerms.price
        finalTerms.duration = result.finalTerms.duration ?? creatorTerms.duration
        finalTerms.territory = result.finalTerms.territory || creatorTerms.territory
        finalTerms.derivatives = result.finalTerms.derivatives ?? creatorTerms.derivatives
      }

      return {
        accepted: result.accepted === true,
        finalTerms: finalTerms,
        reasoning: result.reasoning || 'Negotiation completed',
      }
    } catch (error) {
      console.error('AI Negotiation error:', error)
      return {
        accepted: false,
        finalTerms: creatorTerms,
        reasoning: 'Error during negotiation. Please try again.',
      }
    }
  }

  /**
   * Generates licensing contract in specified language
   * Supports all languages including Indian languages (Hindi, Tamil, Telugu, Kannada, Malayalam, etc.)
   */
  async generateContract(
    terms: LicensingTerms,
    creatorInfo: { name: string; address: string },
    licenseeInfo: { name: string; address: string },
    contentInfo: { title: string; tokenId: string },
    language: string = 'en'
  ): Promise<string> {
    // Language name mapping for better AI understanding
    const languageNames: Record<string, string> = {
      'en': 'English',
      'hi': 'Hindi (हिन्दी)',
      'ta': 'Tamil (தமிழ்)',
      'te': 'Telugu (తెలుగు)',
      'kn': 'Kannada (ಕನ್ನಡ)',
      'ml': 'Malayalam (മലയാളം)',
      'mr': 'Marathi (मराठी)',
      'gu': 'Gujarati (ગુજરાતી)',
      'pa': 'Punjabi (ਪੰਜਾਬੀ)',
      'bn': 'Bengali (বাংলা)',
      'es': 'Spanish (Español)',
      'fr': 'French (Français)',
      'de': 'German (Deutsch)',
      'zh': 'Chinese (中文)',
      'ja': 'Japanese (日本語)',
      'ko': 'Korean (한국어)',
      'ar': 'Arabic (العربية)',
      'ur': 'Urdu (اردو)',
    }
    
    const languageName = languageNames[language] || language
    
    const prompt = `Generate a professional licensing contract in ${languageName} (language code: ${language}).

Terms: ${JSON.stringify(terms)}
Creator: ${JSON.stringify(creatorInfo)}
Licensee: ${JSON.stringify(licenseeInfo)}
Content: ${JSON.stringify(contentInfo)}

IMPORTANT: 
- Generate the ENTIRE contract in ${languageName} language
- Use proper legal terminology in ${languageName}
- Include all standard licensing clauses
- Make it professional and legally sound
- If ${languageName} uses a specific script (like Devanagari, Tamil, Telugu, etc.), write the contract in that script
- Include: parties, terms, duration, territory, payment terms, usage rights, restrictions, termination clauses, and dispute resolution

Generate the complete contract text in ${languageName}.`

    try {
      const response = await callAI(prompt, false)
      return response || ''
    } catch (error) {
      console.error('AI Contract generation error:', error)
      return 'Contract generation failed. Please try again.'
    }
  }

  /**
   * Calculates royalty splits based on terms
   */
  calculateRoyaltySplit(
    totalRevenue: number,
    terms: LicensingTerms,
    creatorShare: number = 0.7,
    platformFee: number = 0.1
  ): { creator: number; licensee: number; platform: number } {
    const platformAmount = totalRevenue * platformFee
    const remaining = totalRevenue - platformAmount
    const creatorAmount = remaining * creatorShare
    const licenseeAmount = remaining * (1 - creatorShare)

    return {
      creator: creatorAmount,
      licensee: licenseeAmount,
      platform: platformAmount,
    }
  }
}

export const aiAgent = new AIAgent()

