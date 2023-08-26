'use client'

import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Chain, WagmiConfig, configureChains, createConfig } from "wagmi";
import { HttpLink, from, ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
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


const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
            alert(`Graphql error ${message}`);
        });
    }
});

const link = from([
    errorLink,
    new HttpLink({ uri: "https://api.studio.thegraph.com/query/51706/orderbook/v0.0.4" }),
]);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
});

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <html lang="en">
            <body suppressHydrationWarning className={font.className}>
                <ApolloProvider client={client}>
                    <WagmiConfig config={config}>
                        <ConnectKitProvider>
                            {children}
                        </ConnectKitProvider>
                    </WagmiConfig>
                </ApolloProvider>

                <Toaster />
            </body>
        </html>



    )
}


