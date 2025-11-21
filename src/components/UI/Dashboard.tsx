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
    <div className="w-auto mx-4 mb-4 md:m-0 md:absolute md:top-4 md:right-4 md:w-80 md:left-auto md:bottom-auto bg-gray-800/90 backdrop-blur rounded-xl shadow-xl text-white border border-gray-700 max-h-[40vh] md:max-h-none flex flex-col flex-shrink-0 z-10">
      <div className="flex justify-between items-center p-4 pb-2 flex-shrink-0">
        <h2 className="text-xl font-bold text-blue-400">RL Control Panel</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
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
