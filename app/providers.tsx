"use client"

import { NextUIProvider } from '@nextui-org/react'
import { Chain, WagmiConfig, configureChains, createConfig } from "wagmi";
//@ts-ignore
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { baseGoerli, } from 'viem/chains';
import { defineChain } from 'viem';
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Toaster } from '@/components/shadcn-ui/toaster';
import theme from "./theme.json"


const blastSepolia = defineChain({
    id: 168587773,
    network: "blast-speolia",
    name: "Blast Sepolia",
    rpcUrls: {
        default: {
            http: ["https://sepolia.blast.io"],
            webSocket: ["wss://sepolia.blast.io"]
        },
        public: {
            http: ["https://sepolia.blast.io"],
        },
    },
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://testnet.blastscan.io/' },
    },
})

const baseTestnet = defineChain({
    id: 168587773,
    network: "blast-speolia",
    name: "Blast Sepolia",
    rpcUrls: {
        default: {
            http: ["https://sepolia.blast.io"],
            webSocket: ["wss://sepolia.blast.io"]
        },
        public: {
            http: ["https://sepolia.blast.io"],
        },
    },
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://testnet.blastscan.io/' },
    },
})

const { publicClient, chains } = configureChains(
    [blastSepolia],
    [
        jsonRpcProvider({
            rpc: (chain: Chain) => {
                return { http: "https://sepolia.blast.io" };
            },
        }),
    ],
);



const config = createConfig(

    getDefaultConfig({
        // Required API Keys
        chains,
        publicClient,
        walletConnectProjectId: "8408650bd8857e532460d5bb327303d1",
        // Required
        appName: "TheAggregator",

        appDescription: "Your most powerful DeFi tools",
        appUrl: "https://theaggregator.xyz", // your app's url
        appIcon: "", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
);



export default function Providers({
    children,
    font
}: {
    children: React.ReactNode, font: any
}) {
    return (
        <>
            <WagmiConfig config={config}>
                <ConnectKitProvider customTheme={{ ...theme }}>
                    <NextUIProvider>
                        {children}
                    </NextUIProvider>
                </ConnectKitProvider>
            </WagmiConfig>
            <Toaster />
        </>
    )
}


