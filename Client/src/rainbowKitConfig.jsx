import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {anvil,zksync,mainnet,sepolia} from "@wagmi/core/chains";

const rainbowKitConfig = getDefaultConfig({
    app:"ReliefSync",
    projectId:import.meta.env.VITE_PROJECT_ID,
    chains:[anvil,zksync,mainnet,sepolia],
    ssr:false
})
export default rainbowKitConfig;