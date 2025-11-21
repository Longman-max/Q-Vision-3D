import { Github } from 'lucide-react';
import { QLearningConfig } from '../../lib/rl/QLearningAgent';

interface DashboardProps {
  config: QLearningConfig;
  onConfigChange: (config: Partial<QLearningConfig>) => void;
  stats: {
    episode: number;
    step: number;
    totalReward: number;
    wins: number;
  };
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  config,
  onConfigChange,
  stats,
  simulationSpeed,
  setSimulationSpeed,
  onReset,
}) => {
  return (
    <div className="w-full md:absolute md:top-4 md:right-4 md:w-80 md:left-auto md:bottom-auto bg-gray-800/90 backdrop-blur p-4 rounded-t-lg md:rounded-lg shadow-xl text-white border-t md:border border-gray-700 max-h-[50vh] md:max-h-none overflow-y-auto flex-shrink-0 z-10">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800/90 pb-2 z-10">
        <h2 className="text-xl font-bold text-blue-400">RL Control Panel</h2>
        <a 
          href="https://github.com/Longman-max/Q-Vision-3D" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors relative group"
        >
          <Github className="w-5 h-5" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            View Source
          </span>
        </a>
      </div>
      
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm bg-gray-900/50 p-2 rounded">
          <div>Episode: <span className="font-mono text-yellow-400">{stats.episode}</span></div>
          <div>Step: <span className="font-mono text-yellow-400">{stats.step}</span></div>
          <div>Reward: <span className="font-mono text-green-400">{stats.totalReward.toFixed(1)}</span></div>
          <div>Wins: <span className="font-mono text-green-400">{stats.wins}</span></div>
        </div>

        <hr className="border-gray-700" />

        {/* Parameters */}
        <div className="space-y-2">
          <label className="flex justify-between text-sm">
            <span>Learning Rate (α)</span>
            <span>{config.alpha.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={config.alpha}
            onChange={(e) => onConfigChange({ alpha: parseFloat(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm">
            <span>Discount Factor (γ)</span>
            <span>{config.gamma.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={config.gamma}
            onChange={(e) => onConfigChange({ gamma: parseFloat(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm">
            <span>Exploration (ε)</span>
            <span>{config.epsilon.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={config.epsilon}
            onChange={(e) => onConfigChange({ epsilon: parseFloat(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>

        <hr className="border-gray-700" />

        {/* Simulation Control */}
        <div className="space-y-2">
          <label className="flex justify-between text-sm">
            <span>Sim Speed ({simulationSpeed}ms)</span>
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
            className="w-full accent-green-500"

          />
          <div className="text-xs text-gray-400 text-right">Faster &larr; &rarr; Slower</div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-bold transition-colors"
        >
          Reset Agent
        </button>
      </div>
    </div>
  );
};
