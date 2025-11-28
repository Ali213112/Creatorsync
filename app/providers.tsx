'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { defineChain } from 'viem'
import { injected } from 'wagmi/connectors'
import { useState } from 'react'

// Story Protocol Testnet (Aeneid)
const storyAeneid = defineChain({
  id: 1315,
  name: 'Story Aeneid Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.aeneid.storyprotocol.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://aeneid.blockscout.storyprotocol.com',
    },
  },
})

// Story Protocol Mainnet
const storyMainnet = defineChain({
  id: 1514,
  name: 'Story Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.storyprotocol.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout.storyprotocol.com',
    },
  },
})

const config = createConfig({
  chains: [storyAeneid, storyMainnet, mainnet, sepolia], // Story networks first!
  connectors: [
    injected({ 
      shimDisconnect: true,
    })
  ],
  transports: {
    [storyAeneid.id]: http(),
    [storyMainnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

