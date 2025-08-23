import { PrivyClientConfig } from '@privy-io/react-auth';


export const appId = "cmeeuf2td01bjl70ckbe3yevz";


const monadConfig = {
    id: 10143,
    name: "Monad Testnet",
    network: "monad-testnet",
    nativeCurrency: {
        "name": "Monad",
        "symbol": "MON",
        "decimals": 18
    },
    rpcUrls: {
        "default": {
            "http": ["https://rpc-testnet.monad.xyz"]
        }
    },
    blockExplorers: {
        "default": {
            "name": "Monad Explorer",
            "url": "https://testnet.monadexplorer.com"
        }
    },
    testnet: true,
};


export const privyConfig: PrivyClientConfig = {
    // Create embedded wallets for users who don't have a wallet
    loginMethodsAndOrder: {
        primary: ['privy:cmd8euall0037le0my79qpz42'],
    },
    defaultChain: monadConfig,
    supportedChains: [monadConfig],
    appearance: {
        //theme: 'dark',
        //loginMessage: 'hello',
    },
};
