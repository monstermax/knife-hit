import { LeaderboardEntry } from '@/types/game';
import { getLeaderBoard } from '@/utils/backend_api';
import { FC, useEffect, useState } from 'react';



interface LeaderboardProps {
    isOpen: boolean;
    onClose: () => void;
}


export const Leaderboard: FC<LeaderboardProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[] | null>(null);

    useEffect(() => {
        getLeaderBoard()
            .then((leaderboard) => {
                console.log('leaderboard:', leaderboard);
                setLeaderboardData(leaderboard);
            })

    }, [])

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-purple-900/90 backdrop-blur-md rounded-2xl border border-purple-500/30 shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                    <h2 className="text-2xl font-bold text-purple-300">🏆 Leaderboard</h2>
                    <button
                        onClick={onClose}
                        className="text-purple-300 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-purple-700/50"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="space-y-3">
                        {!leaderboardData && (
                            <>
                                Loading...
                            </>
                        )}

                        {leaderboardData && leaderboardData.map((entry) => (
                            <div
                                key={entry.rank}
                                className="flex items-center justify-between bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/10 hover:border-purple-400/20 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        entry.rank === 1 ? 'bg-yellow-500 text-black' :
                                        entry.rank === 2 ? 'bg-gray-300 text-black' :
                                        entry.rank === 3 ? 'bg-orange-600 text-white' :
                                        'bg-purple-600 text-white'
                                    }`}>
                                        {entry.rank}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium text-sm">{entry.username}</div>
                                        <div className="text-purple-300 text-xs">{entry.transactionCount ?? 'n/a'} games</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-purple-400 font-bold text-lg">{entry.score?.toLocaleString()}</div>
                                    <div className="text-gray-400 text-xs">pts</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-purple-500/20 text-center">
                    <div className="text-purple-300 text-sm">
                        Keep playing to climb the leaderboard! 🔪
                    </div>
                </div>
            </div>
        </div>
    );
};