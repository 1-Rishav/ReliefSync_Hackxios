import {useState} from 'react';
import { lightTheme , RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import config from '../../rainbowKitConfig';
import { WagmiProvider } from 'wagmi';
import "@rainbow-me/rainbowkit/styles.css";

export function WalletProvider({children}){
    const [queryClient] = useState(()=>new QueryClient())
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={lightTheme({
                    accentColor:'#1E40AF',
                    accentColorForeground:'white',
                    borderRadius:'medium'
                })}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}