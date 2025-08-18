
import { defineChain } from 'viem';


// Configuration de la chaine Monad Testnet
export const monadTestnet = defineChain({
    id: 10143,
    name: 'Monad Testnet',
    network: 'monad-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Monad',
        symbol: 'MON',
    },
    rpcUrls: {
        default: {
            http: ['https://testnet-rpc.monad.xyz'],
        },
        public: {
            http: ['https://testnet-rpc.monad.xyz'],
        },
    },
    blockExplorers: {
        default: { name: 'Monad', url: 'https://testnet-explorer.monad.xyz' },
    },
});

