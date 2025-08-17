import { useEffect, useState } from 'react';
import { usePrivy, useWallets, useConnectWallet, type CrossAppAccountWithMetadata } from "@privy-io/react-auth";


export default function MonadGamesId() {
    const { authenticated, user, ready, logout } = usePrivy();
    const { wallets } = useWallets();
    const { connectWallet } = useConnectWallet();

    const [accountAddress, setAccountAddress] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchUsername = async (walletAddress: string) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`);
            if (response.ok) {
                const data = await response.json();
                setUsername(data.hasUsername ? data.user.username : "");
            }
        } catch (err) {
            console.error("Error fetching username:", err);
            setError("Failed to load username");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWallet = async () => {
        try {
            // Utiliser connectWallet sans paramètres pour créer un wallet intégré
            await connectWallet();

        } catch (err) {
            console.error("Error creating wallet:", err);
            setError("Failed to create wallet");
        }
    };

    useEffect(() => {
        setAccountAddress("");
        setUsername("");
        setError("");

        if (authenticated && user && ready && user.linkedAccounts.length > 0) {
            const crossAppAccount = user.linkedAccounts.find(
                account => account.type === "cross_app" && account.providerApp.id === "cmd8euall0037le0my79qpz42"
            ) as CrossAppAccountWithMetadata;

            if (crossAppAccount?.embeddedWallets.length > 0) {
                const walletAddress = crossAppAccount.embeddedWallets[0].address;
                setAccountAddress(walletAddress);
                fetchUsername(walletAddress);
            } else {
                setError("Monad Games ID account not found");
            }
        } else if (authenticated && user && ready) {
            setError("Please link your Monad Games ID account");
        }
    }, [authenticated, user, ready]);

    if (!ready) {
        return (
            <div className="monad-games-id p-4 bg-gray-800 rounded-lg">
                <div className="text-center text-gray-300">Loading Monad Games ID...</div>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div className="monad-games-id p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">Monad Games ID</h3>
                <p className="text-gray-300">Connect your wallet to access Monad Games ID</p>
            </div>
        );
    }

    return (
        <div className="monad-games-id p-4 bg-gray-800 rounded-lg max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">🎮 Monad Games ID</h3>

            {error && (
                <div className="error bg-red-600 text-white p-2 rounded mb-4">
                    {error}
                </div>
            )}

            {accountAddress ? (
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center text-gray-300">Loading username...</div>
                    ) : username ? (
                        <div className="username-section bg-green-700 p-3 rounded">
                            <div className="text-green-100 text-sm">Username</div>
                            <div className="text-white font-bold text-lg">{username}</div>
                        </div>
                    ) : (
                        <div className="no-username bg-yellow-700 p-3 rounded">
                            <div className="text-yellow-100 text-sm mb-2">No username registered</div>
                            <a
                                href="https://monad-games-id-site.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                                Register Username →
                            </a>
                        </div>
                    )}

                    <div className="wallet-section bg-gray-700 p-3 rounded">
                        <div className="text-gray-300 text-sm mb-1">Wallet Address</div>
                        <code className="text-green-400 text-xs break-all">
                            {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
                        </code>
                    </div>

                    <div className="text-center">
                        <a
                            href="https://monad-games-id-site.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-sm"
                        >
                            🔗 Visit Monad Games ID
                        </a>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={logout}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors cursor-pointer"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-300 mb-4">No wallet detected</p>
                    <button
                        onClick={handleCreateWallet}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                    >
                        Create Embedded Wallet
                    </button>
                </div>
            )}
        </div>
    );
}

