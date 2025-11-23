import { useState } from 'react';
import { QLearningConfig } from '../../lib/rl/QLearningAgent';
import { Activity, Zap, RotateCcw, Settings, Play, Pause, SkipForward, ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardProps {
  config: QLearningConfig;
  onConfigChange: (config: Partial<QLearningConfig>) => void;
  stats: {
    episode: number;
    step: number;
    totalReward: number;
    wins: number;
    history: number[];
  };
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  onReset: () => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  onStep: () => void;
}

const RewardChart: React.FC<{ history: number[] }> = ({ history }) => {
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
        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30 mt-4">
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

export const Dashboard: React.FC<DashboardProps> = ({
  config,
  onConfigChange,
  stats,
  simulationSpeed,
  setSimulationSpeed,
  onReset,
  isPaused,
  setIsPaused,
  onStep
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`
        fixed bottom-4 left-4 right-4 md:absolute md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-80 
        bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl text-white border border-teal-700/50 
        flex flex-col flex-shrink-0 z-10 transition-all duration-300 
        ${isCollapsed ? 'h-auto' : 'max-h-[45vh] md:max-h-[90vh]'}
    `}>
      {/* Header / Toggle */}
      <div 
        className="flex justify-between items-center p-4 border-b border-slate-700/50 cursor-pointer md:cursor-default"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">Control Center</h2>
        </div>
        <div className="flex items-center gap-2">
            <div className="text-xs font-mono text-slate-400 bg-slate-800/50 px-2 py-1 rounded hidden md:block">v1.1</div>
            <div className="md:hidden text-slate-400">
                {isCollapsed ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
        </div>
      </div>
      
      {/* Content */}
      <div className={`flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar overscroll-contain ${isCollapsed ? 'hidden md:block' : 'block'}`}>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
            <div className="text-xs text-slate-400 mb-1">Episode</div>
            <div className="text-xl font-bold font-mono text-white">{stats.episode}</div>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
            <div className="text-xs text-slate-400 mb-1">Step</div>
            <div className="text-xl font-bold font-mono text-cyan-400">{stats.step}</div>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
            <div className="text-xs text-slate-400 mb-1">Reward</div>
            <div className={`text-xl font-bold font-mono ${stats.totalReward >= 0 ? 'text-teal-400' : 'text-orange-400'}`}>
                {stats.totalReward.toFixed(1)}
            </div>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
            <div className="text-xs text-slate-400 mb-1">Wins</div>
            <div className="text-xl font-bold font-mono text-cyan-400">{stats.wins}</div>
          </div>
        </div>

        <RewardChart history={stats.history} />

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3">
            <button
                onClick={() => setIsPaused(!isPaused)}
                className={`p-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${isPaused ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-900/20' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20'}`}
            >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
            </button>
            
            <button
                onClick={onStep}
                disabled={!isPaused}
                className={`p-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${!isPaused ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20'}`}
            >
                <SkipForward className="w-4 h-4" />
                Step
            </button>
        </div>

        {/* Training Mode Toggle */}
        <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-teal-300 font-medium">
                    <Zap className="w-4 h-4" />
                    <span>Training Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={config.trainingMode || false}
                        onChange={(e) => onConfigChange({ trainingMode: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
            </div>
            <p className="text-xs text-teal-200/60">
                Disables rendering delay to maximize learning speed.
            </p>
        </div>

        {/* Parameters */}
        <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300 border-b border-slate-700/50 pb-2">
                <Settings className="w-4 h-4" />
                <span>Hyperparameters</span>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Learning Rate (α)</span>
                    <span className="font-mono text-cyan-300">{config.alpha.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={config.alpha}
                    onChange={(e) => onConfigChange({ alpha: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Discount Factor (γ)</span>
                    <span className="font-mono text-teal-300">{config.gamma.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={config.gamma}
                    onChange={(e) => onConfigChange({ gamma: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Exploration (ε)</span>
                    <span className="font-mono text-cyan-300">{config.epsilon.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={config.epsilon}
                    onChange={(e) => onConfigChange({ epsilon: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
            </div>
        </div>

        {/* Simulation Speed */}
        {!config.trainingMode && (
            <div className="space-y-3 pt-2 border-t border-slate-700/50">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1"><Play className="w-3 h-3"/> Sim Speed</span>
                    <span className="font-mono text-teal-300">{simulationSpeed}ms</span>
                </div>
                <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={510 - simulationSpeed}
                    onChange={(e) => setSimulationSpeed(510 - parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    <span>Slow</span>
                    <span>Fast</span>
                </div>
            </div>
        )}

        <button
          onClick={onReset}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 rounded-xl font-bold text-sm shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center gap-2 group"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
          Reset Agent
        </button>
      </div>
    </div>
  );
};
