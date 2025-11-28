# CreatorSync - AI-Powered IP Licensing Marketplace

An AI-powered IP licensing marketplace where creators can tokenize their content (music, videos, art) and AI agents automatically handle licensing negotiations, pricing, contract generation, and royalty distribution using Story Protocol blockchain.

## 🎯 Project Overview

CreatorSync empowers content creators globally by providing professional IP tools through AI automation and blockchain technology. Built on Story Protocol, it enables seamless IP asset registration, automated licensing, and transparent royalty distribution.

> **Note**: This is currently an MVP/demo version. The app uses in-memory database and mock file storage. For production, you'll need to add a real database (PostgreSQL/MongoDB) and file storage (IPFS/Arweave/S3). The blockchain integration with Story Protocol is fully functional.

## 🏗️ Core Features

1. **Creator Portal** - Upload content, manage profile, view assets and revenue
2. **AI Agent System** - Automated content analysis, pricing, negotiation, and contract generation
3. **IP Tokenization** - Story Protocol integration for on-chain IP registration
4. **Licensing Marketplace** - Browse, filter, and request content licensing
5. **Smart Contract Management** - Automated agreements and royalty distribution
6. **Multi-Language Support** - Contract generation in multiple languages

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet
- Story Protocol testnet tokens (for testing)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd creatorsync

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Story Protocol Configuration
NEXT_PUBLIC_STORY_PROTOCOL_NETWORK=aeneid
STORY_PROTOCOL_API_KEY=your_api_key_here

# AI Configuration (use either OpenAI or Hugging Face)
OPENAI_API_KEY=your_openai_key_here
# OR
HUGGINGFACE_API_KEY=your_huggingface_key_here

# Wallet Connect (optional)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Story Protocol SDK, Ethers.js, Wagmi, Viem
- **AI**: OpenAI API, Hugging Face Inference
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS, Framer Motion

## 📚 Story Protocol Integration

This project uses the official Story Protocol SDK for:
- IP Asset registration on blockchain
- On-chain licensing agreements
- Automated royalty distribution
- Derivative work tracking

**Network**: Story Aeneid Testnet (Chain ID: 1315)

## 🌐 Deployment

### Deploy to Vercel (Recommended - Free & Easy)

1. **Push to GitHub:**
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - Add environment variables (see below)
   - Click "Deploy"

3. **Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_STORY_PROTOCOL_NETWORK` = `aeneid`
     - `STORY_PROTOCOL_API_KEY` = (your key)
     - `OPENAI_API_KEY` = (your key) OR `HUGGINGFACE_API_KEY` = (your key)

4. **Done!** Your app will be live at `https://your-project.vercel.app`

### Other Platforms

- **Netlify**: Connect GitHub repo, build command: `npm run build`, publish: `.next`
- **AWS Amplify**: Connect repo, use Next.js defaults
- **Any Node.js host**: Run `npm run build` then `npm start`

## 📖 Documentation

- [Story Protocol Docs](https://docs.story.foundation)
- [Story Protocol SDK Reference](https://docs.story.foundation/sdk-reference)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT

## 🔗 Links

- **Live Demo**: [Add your deployed URL here]
- **Story Protocol**: https://story.foundation
- **Documentation**: https://docs.story.foundation

