import { PrivyClientConfig } from '@privy-io/react-auth';


export const appId = "cmeeuf2td01bjl70ckbe3yevz";


export const privyConfig: PrivyClientConfig = {
    // Create embedded wallets for users who don't have a wallet
    "loginMethodsAndOrder": {
        primary: ['privy:cmd8euall0037le0my79qpz42'],
    },
    /*
    "appearance": {
        "accentColor": "#6A6FF5",
        "theme": "#ffffff",
        "showWalletLoginFirst": false,
        "logo": "https://auth.privy.io/logos/privy-logo.png",
        "walletChainType": "ethereum-only"
    },
    "loginMethods": [
        "wallet",
        "email",
        "google",
        "twitter",
        "github",
        "apple",
        "discord"
    ],
    "fundingMethodConfig": {
        "moonpay": {
            "useSandbox": true
        }
    },
    "embeddedWallets": {
        "requireUserPasswordOnCreate": false,
        "showWalletUIs": true,
        "ethereum": {
            "createOnLogin": "all-users"
        },
        "solana": {
            "createOnLogin": "off"
        }
    },
    "mfa": {
        "noPromptOnMfaRequired": false
    },
    "externalWallets": {},
    "supportedChains": [
        // Ajout du support pour Monad testnet
        {
            "id": 10143,
            "name": "Monad Testnet",
            "network": "monad-testnet",
            "nativeCurrency": {
                "name": "Monad",
                "symbol": "MON",
                "decimals": 18
            },
            "rpcUrls": {
                "default": {
                    "http": ["https://testnet1.monad.xyz"]
                }
            },
            "blockExplorers": {
                "default": {
                    "name": "Monad Explorer",
                    "url": "https://explorer-testnet.monad.xyz"
                }
            },
            "testnet": true
        }
    ],
    */
};
