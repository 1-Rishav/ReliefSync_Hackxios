import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import {sepolia} from "@wagmi/core/chains";

const rainbowKitConfig = getDefaultConfig({
    appName:"ReliefSync",
    projectId:import.meta.env.VITE_PROJECT_ID,
    chains:[sepolia],
    ssr:false,
    transports: {
      [sepolia.id]: http(import.meta.env.VITE_ALCHEMY_URL, {
        batch: false,         
        retryCount: 5,       
        retryDelay: 1000,     
        timeout: 60_000,     
      })
    },
})
export default rainbowKitConfig;