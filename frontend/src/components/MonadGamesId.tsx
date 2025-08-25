
import { FC } from 'react';

import { GameFullState } from '@/types/game';


type MonadGamesIdProps = {
    gameFullState: GameFullState,
}


export const MonadGamesId: FC<MonadGamesIdProps> = ({ gameFullState }) => {

    const { authenticated, ready, accountAddress, error, loading, username, logout, handleCreateWallet } = gameFullState;

    if (!ready) {
        return (
            <div className="monad-games-id p-4 bg-purple-900/50 backdrop-blur-sm rounded-lg border border-purple-500/20">
                <div className="text-center text-gray-300">Loading Monad Games ID...</div>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div className="monad-games-id p-4 bg-purple-900/50 backdrop-blur-sm rounded-lg border border-purple-500/20">
                <h3 className="text-lg font-bold text-white mb-2">Monad Games ID</h3>
                <p className="text-gray-300">Connect your wallet to access Monad Games ID</p>
            </div>
        );
    }

    return (
        <div className="monad-games-id p-4 bg-purple-900/50 backdrop-blur-sm rounded-lg border border-purple-500/20 max-w-md">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-bold text-white">🎮 Monad Games ID</h3>
                <a
                    href="https://monad-games-id-site.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    title="Visit Monad Games ID"
                >
                    🔗
                </a>
            </div>

            {error && (
                <div className="error bg-red-600 text-white p-2 rounded mb-4">
                    {error}
                </div>
            )}

            {accountAddress ? (
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center text-gray-300">Loading username...</div>
                    ) : (
                        <div className="flex gap-4">
                            {username ? (
                                <div className="username-section bg-purple-700/70 p-3 rounded flex-1">
                                    <div className="text-purple-100 text-sm">Username</div>
                                    <div className="text-white font-bold text-lg">{username}</div>
                                </div>
                            ) : (
                                <div className="no-username bg-indigo-700/70 p-3 rounded flex-1">
                                    <div className="text-indigo-100 text-sm mb-2">No username registered</div>
                                    <a
                                        href="https://monad-games-id-site.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        Register Username →
                                    </a>
                                </div>
                            )}

                            <div className="wallet-section bg-slate-700/70 p-3 rounded flex-1">
                                <div className="text-gray-300 text-sm mb-1">Wallet Address</div>
                                <code className="text-purple-300 text-xs break-all">
                                    {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
                                </code>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={logout}
                            className="flex-1 bg-red-600/80 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors cursor-pointer"
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
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors"
                    >
                        Create Embedded Wallet
                    </button>

                    <br />

                    <div className="flex gap-2">
                        <button
                            onClick={logout}
                            className="flex-1 bg-red-600/80 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors cursor-pointer"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

