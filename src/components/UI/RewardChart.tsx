import React from 'react';

export const RewardChart: React.FC<{ history: number[]; className?: string }> = ({ history, className = "" }) => {
    if (history.length < 2) return null;

    const width = 280;
    const height = 60;
    const padding = 5;
    
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    
    const points = history.map((val, i) => {
        const x = (i / (history.length - 1)) * (width - 2 * padding) + padding;
        const y = height - ((val - min) / range) * (height - 2 * padding) - padding;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className={`bg-slate-800/40 p-3 rounded-xl border border-slate-700/30 ${className}`}>
            <div className="text-xs text-slate-400 mb-2 flex justify-between">
                <span>Reward History</span>
                <span className="font-mono text-cyan-400">Last: {history[history.length - 1].toFixed(0)}</span>
            </div>
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                <polyline
                    points={points}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};
