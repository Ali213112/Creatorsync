import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Zap, Globe } from 'lucide-react'
import { ConnectButton } from '@/components/ConnectButton'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-white drop-shadow-lg">CreatorSync</div>
          <div className="flex gap-4 items-center">
            <Link href="/marketplace" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Marketplace
            </Link>
            <Link href="/creator" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Creator Portal
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          AI-Powered IP Licensing
          <br />
          <span className="gradient-text">Made Simple</span>
        </h1>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
          Tokenize your content and let AI agents handle licensing negotiations, 
          pricing, contracts, and royalty distribution on Story Protocol.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/creator"
            className="glass-strong text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
          <Link
            href="/marketplace"
            className="glass text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Browse Marketplace
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Agent</h3>
            <p className="text-white/80 text-sm">
              Automated content analysis, pricing suggestions, and negotiation
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">IP Tokenization</h3>
            <p className="text-white/80 text-sm">
              Register and tokenize your content on Story Protocol blockchain
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Contracts</h3>
            <p className="text-white/80 text-sm">
              Auto-generated licensing agreements and royalty distribution
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center mb-4 shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Global Marketplace</h3>
            <p className="text-white/80 text-sm">
              Connect creators and licensees worldwide
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12 drop-shadow-lg">How It Works</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="glass-card p-6 rounded-2xl flex gap-6 items-start hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl text-white flex-shrink-0 shadow-lg">
              1
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">Upload Your Content</h3>
              <p className="text-white/80">
                Creators upload their music, videos, or art through the Creator Portal
              </p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex gap-6 items-start hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xl text-white flex-shrink-0 shadow-lg">
              2
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">AI Analysis & Tokenization</h3>
              <p className="text-white/80">
                AI agent analyzes your content and tokenizes it on Story Protocol
              </p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex gap-6 items-start hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center font-bold text-xl text-white flex-shrink-0 shadow-lg">
              3
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">AI Negotiates & Contracts</h3>
              <p className="text-white/80">
                When licensees request your content, AI agent negotiates terms and generates contracts
              </p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex gap-6 items-start hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center font-bold text-xl text-white flex-shrink-0 shadow-lg">
              4
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">Automatic Revenue Distribution</h3>
              <p className="text-white/80">
                Smart contracts automatically distribute royalties to all parties
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

