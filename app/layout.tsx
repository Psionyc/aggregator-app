'use client'

import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Chain, WagmiConfig, configureChains, createConfig } from "wagmi";
//@ts-ignore
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { baseGoerli } from 'viem/chains';
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Toaster } from '@/components/ui/toaster';

const { publicClient, chains } = configureChains(
    [baseGoerli],
    [
        jsonRpcProvider({
            rpc: (chain: Chain) => {
                return { http: "https://base-goerli.blastapi.io/fdde1d88-9cdb-4e2e-bfe3-d3ef8d08b66e" };
            },
        }),
    ],
);

const config = createConfig(
    getDefaultConfig({
        // Required API Keys
        chains,
        publicClient,

        // Required
        appName: "TheAggregator",

        appDescription: "Your most powerful DeFi tools",
        appUrl: "https://theaggregator.xyz", // your app's url
        appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
);






const font = Poppins({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })

export const metadata: Metadata = {
    title: 'Dapp',
    description: 'Aggregator Dapp Space',

}

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <html lang="en">
            <body suppressHydrationWarning className={font.className}>
                <WagmiConfig config={config}>
                    <ConnectKitProvider>
                        {children}
                    </ConnectKitProvider>
                </WagmiConfig>
                <Toaster />
            </body>
        </html>



    )
}


