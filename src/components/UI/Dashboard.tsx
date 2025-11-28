import { useState } from "react";
import { QLearningConfig } from "../../lib/rl/QLearningAgent";
import {
  Activity,
  Zap,
  RotateCcw,
  Settings,
  Play,
  Pause,
  SkipForward,
  ChevronDown,
  ChevronUp,
  Maximize,
} from "lucide-react";
import { RewardChart } from "./RewardChart";

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

  onResetCamera: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  config,
  onConfigChange,
  stats,
  simulationSpeed,
  setSimulationSpeed,
  onReset,
  isPaused,
  setIsPaused,
  onStep,

  onResetCamera,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`
        fixed bottom-4 left-4 right-4 md:absolute md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-72 lg:w-80 
        bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl text-white border border-teal-700/50 
        flex flex-col flex-shrink-0 z-10 transition-all duration-300 
        ${
          isCollapsed
            ? "h-auto"
            : "max-h-[45vh] md:max-h-[80vh] lg:max-h-[90vh]"
        }
    `}
    >
      {/* Header / Toggle */}
      <div
        className="flex justify-between items-center p-3 border-b border-slate-700/50 cursor-pointer md:cursor-default"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
            Control Center
          </h2>
        </div>

        <div
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Camera Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetCamera}
              className="text-slate-400 hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] p-1"
              title="Reset Zoom"
            >
              <Maximize className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div
            className="md:hidden text-slate-400 ml-2 cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar overscroll-contain ${
          isCollapsed ? "hidden md:block" : "block"
        }`}
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
            <div className="text-xs text-slate-400 mb-1">Episode</div>
            <div className="text-xl font-bold font-mono text-white">
              {stats.episode}
            </div>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
            <div className="text-xs text-slate-400 mb-1">Step</div>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {stats.step}
            </div>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
            <div className="text-xs text-slate-400 mb-1">Reward</div>
            <div
              className={`text-xl font-bold font-mono ${
                stats.totalReward >= 0 ? "text-teal-400" : "text-orange-400"
              }`}
            >
              {stats.totalReward.toFixed(1)}
            </div>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
            <div className="text-xs text-slate-400 mb-1">Wins</div>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {stats.wins}
            </div>
          </div>
        </div>

        <RewardChart history={stats.history} className="lg:hidden" />

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              isPaused
                ? "bg-teal-600 hover:bg-teal-500 shadow-teal-900/20"
                : "bg-orange-600 hover:bg-orange-500 shadow-orange-900/20"
            }`}
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={onStep}
            disabled={!isPaused}
            className={`p-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              !isPaused
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20"
            }`}
          >
            <SkipForward className="w-4 h-4" />
            Step
          </button>
        </div>

        {/* Training Mode Toggle */}
        <div className="bg-teal-500/10 border border-teal-500/20 p-3 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-teal-300 font-medium">
              <Zap className="w-4 h-4" />
              <span>Training Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={config.trainingMode || false}
                onChange={(e) =>
                  onConfigChange({ trainingMode: e.target.checked })
                }
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>
          <p className="text-[10px] text-teal-200/60 leading-tight">
            Disables rendering delay for max speed.
          </p>
        </div>

        {/* Parameters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-300 border-b border-slate-700/50 pb-2">
            <Settings className="w-4 h-4" />
            <span>Hyperparameters</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Learning Rate (α)</span>
              <span className="font-mono text-cyan-300">
                {config.alpha.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.alpha}
              onChange={(e) =>
                onConfigChange({ alpha: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Discount Factor (γ)</span>
              <span className="font-mono text-teal-300">
                {config.gamma.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.gamma}
              onChange={(e) =>
                onConfigChange({ gamma: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Exploration (ε)</span>
              <span className="font-mono text-cyan-300">
                {config.epsilon.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.epsilon}
              onChange={(e) =>
                onConfigChange({ epsilon: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* Simulation Speed */}
        <div
          className={`space-y-2 pt-2 border-t border-slate-700/50 transition-opacity duration-300 ${
            config.trainingMode ? "opacity-40 grayscale" : "opacity-100"
          }`}
          title={config.trainingMode ? "Training Mode is active ⵄ" : ""}
        >
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Play className="w-3 h-3" /> Sim Speed
            </span>
            <span className="font-mono text-teal-300">{simulationSpeed}ms</span>
          </div>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={510 - simulationSpeed}
            onChange={(e) => setSimulationSpeed(510 - parseInt(e.target.value))}
            className={`w-full h-1.5 bg-slate-700 rounded-lg appearance-none accent-teal-500 ${
              config.trainingMode ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          />
          <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

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
