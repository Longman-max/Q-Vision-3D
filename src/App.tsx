import { useState, useEffect } from "react";
import { Github, Info, X } from "lucide-react";

import { GridWorld } from "./components/World/GridWorld";
import { Dashboard } from "./components/UI/Dashboard";
import { useQLearning } from "./hooks/useQLearning";

import { RewardChart } from "./components/UI/RewardChart";
import { MobileWarning } from "./components/UI/MobileWarning";

function App() {
  const [showInfo, setShowInfo] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetCameraTrigger, setResetCameraTrigger] = useState(0);

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showInfo) {
        setShowInfo(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showInfo]);

  const {
    agentPosition,
    gridSize,
    goalPosition,
    hazards,
    agent,
    stats,
    config,
    simulationSpeed,
    setSimulationSpeed,
    handleReset,
    handleConfigChange,
    isPaused,
    setIsPaused,
    step,
  } = useQLearning();

  return (
    <div className="relative w-full h-[100dvh] bg-[#000000] overflow-hidden">
      <MobileWarning />
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-30 p-4 pointer-events-none flex justify-center md:justify-between items-start">
        {/* Title & Controls Card */}
        <div className="bg-slate-900/80 backdrop-blur-md px-5 py-3 md:px-6 md:py-4 rounded-xl border border-teal-700/50 shadow-xl pointer-events-auto w-fit flex items-center gap-4 md:gap-6">
          <h1 className="text-white font-bold text-lg md:text-xl leading-none whitespace-nowrap">
            Q-Vision 3D
          </h1>

          <div className="h-8 w-px bg-slate-700/50"></div>

          <button
            onClick={() => setShowInfo(true)}
            className="text-slate-400 hover:text-teal-400 transition-colors group"
            title="About & Help"
          >
            <Info className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <a
            href="https://github.com/Longman-max/Q-Vision-3D"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-teal-400 transition-colors group"
            title="View Source on GitHub"
          >
            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </a>

          <div className="h-8 w-px bg-slate-700/50"></div>

          <div
            className="flex items-center gap-2 text-slate-400 cursor-not-allowed group opacity-70"
            title="coming soon"
          >
            <span className="font-bold text-base text-white group-hover:text-slate-300 transition-colors whitespace-nowrap">
              Interact
            </span>
            <svg
              className="w-7 h-7 text-teal-500 group-hover:scale-100 transition-transform"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {/* Infinity Loop Base */}
              <path d="M7.5 7C4.46 7 2 9.46 2 12.5S4.46 18 7.5 18 12.5 15.5 12.5 12.5 10.54 7 7.5 7zm0 9c-1.93 0-3.5-1.57-3.5-3.5S5.57 9 7.5 9 11 10.57 11 12.5 9.43 16 7.5 16z" />
              <path d="M16.5 7C13.46 7 11.5 9.46 11.5 12.5S13.46 18 16.5 18 22 15.54 22 12.5 19.54 7 16.5 7zm0 9c-1.93 0-3.5-1.57-3.5-3.5S14.57 9 16.5 9 20 10.57 20 12.5 18.43 16 16.5 16z" />
              {/* Plus Sign (Left) */}
              <rect x="6.5" y="10.5" width="2" height="4" rx="0.2" />
              <rect x="5.5" y="11.5" width="4" height="2" rx="0.2" />
              {/* Minus Sign (Right) */}
              <rect x="14.5" y="11.5" width="4" height="2" rx="0.2" />
            </svg>
          </div>
        </div>

        {/* Center Stats & Chart Container */}
        <div className="hidden lg:flex flex-col items-center gap-2 absolute left-1/2 -translate-x-1/2 top-4 pointer-events-auto">
          {/* Stats Row */}
          <div className="bg-slate-900/80 backdrop-blur-md px-8 py-3 rounded-xl border border-teal-700/50 shadow-xl flex items-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Episode
              </span>
              <span className="text-xl font-mono font-bold text-white leading-none">
                {stats.episode}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Step
              </span>
              <span className="text-xl font-mono font-bold text-cyan-400 leading-none">
                {stats.step}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Reward
              </span>
              <span
                className={`text-xl font-mono font-bold leading-none ${
                  stats.totalReward >= 0 ? "text-teal-400" : "text-orange-400"
                }`}
              >
                {stats.totalReward.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Wins
              </span>
              <span className="text-xl font-mono font-bold text-cyan-400 leading-none">
                {stats.wins}
              </span>
            </div>
          </div>

          {/* Reward Chart */}
          <div className="w-full">
            <RewardChart
              history={stats.history}
              className="bg-slate-900/80 backdrop-blur-md border border-teal-700/50 shadow-xl !mt-0"
            />
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-slate-900 rounded-2xl border border-teal-700/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-teal-700/50 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Q-Vision 3D</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-slate-300">
              {/* Purpose */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-2">About</h3>
                <p className="text-sm leading-relaxed">
                  Q-Vision 3D is an interactive 3D visualization of Q-Learning
                  reinforcement learning in action. Watch a wooden robot agent
                  learn to navigate a grid world, avoid hazards, and reach its
                  goal through trial and error.
                </p>
              </section>

              {/* Controls */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-3">
                  Controls
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pause/Resume:</span>
                    <span className="font-mono">Click Pause/Resume button</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Step:</span>
                    <span className="font-mono">Click Step (when paused)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">3D View:</span>
                    <span className="font-mono">Click + Drag to rotate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Zoom:</span>
                    <span className="font-mono">Scroll wheel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reset Agent:</span>
                    <span className="font-mono">Click Reset Agent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reset Zoom:</span>
                    <span className="font-mono">Click Maximize Icon</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Auto Rotate:</span>
                    <span className="font-mono">Click Orbit Icon</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interact:</span>
                    <span className="font-mono">
                      Connect Arduino (Coming Soon)
                    </span>
                  </div>
                </div>
              </section>

              {/* Stats Explanation */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-3">
                  Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-white">Episode:</span>
                    <span className="ml-2">
                      Number of complete training runs (goal reached or hazard
                      hit).
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Step:</span>
                    <span className="ml-2">
                      Current number of moves in the current episode.
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Reward:</span>
                    <span className="ml-2">
                      Cumulative reward for the current episode (+10 goal, -10
                      hazard, -0.01 per step).
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Wins:</span>
                    <span className="ml-2">
                      Total successful episodes where the agent reached the
                      goal.
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      Reward History:
                    </span>
                    <span className="ml-2">
                      Chart showing total reward for each completed episode.
                    </span>
                  </div>
                </div>
              </section>

              {/* Hyperparameters */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-3">
                  Hyperparameters
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-white">
                      Learning Rate (α):
                    </span>
                    <span className="ml-2">
                      How much new information overrides old (0-1). Higher =
                      faster learning.
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      Discount Factor (γ):
                    </span>
                    <span className="ml-2">
                      Importance of future rewards (0-1). Higher = more
                      long-term planning.
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      Exploration (ε):
                    </span>
                    <span className="ml-2">
                      Probability of random action (0-1). Higher = more
                      exploration vs exploitation.
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      Simulation Speed:
                    </span>
                    <span className="ml-2">
                      Delay between steps in milliseconds (10-500ms). Lower =
                      faster simulation.
                    </span>
                  </div>
                </div>
              </section>

              {/* Visual Elements */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-3">
                  Visual Elements
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded bg-[#4FB477] mt-0.5"></div>
                    <div>
                      <span className="font-semibold text-white">
                        Green Tile:
                      </span>
                      <span className="ml-2">Goal position (+10 reward)</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded bg-[#DD4B39] mt-0.5"></div>
                    <div>
                      <span className="font-semibold text-white">
                        Red Tile:
                      </span>
                      <span className="ml-2">Hazard (-10 reward)</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded bg-white border border-slate-700 mt-0.5"></div>
                    <div>
                      <span className="font-semibold text-white">
                        White Arrows:
                      </span>
                      <span className="ml-2">
                        Show learned policy (best action direction)
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Training Mode */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-2">
                  Training Mode
                </h3>
                <p className="text-sm leading-relaxed">
                  Enable to maximize learning speed by disabling rendering
                  delays. The agent will train much faster, but you won't see
                  individual moves. Useful for quick convergence to optimal
                  policy.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 w-full h-full"
        onClick={() => autoRotate && setAutoRotate(false)}
      >
        <GridWorld
          agentPosition={agentPosition}
          gridSize={gridSize}
          goalPosition={goalPosition}
          hazards={hazards}
          agent={agent}
          episode={stats.episode}
          autoRotate={autoRotate}
          resetCameraTrigger={resetCameraTrigger}
        />
      </div>

      <Dashboard
        config={config}
        onConfigChange={handleConfigChange}
        stats={stats}
        simulationSpeed={simulationSpeed}
        setSimulationSpeed={setSimulationSpeed}
        onReset={handleReset}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        onStep={step}
        onResetCamera={() => setResetCameraTrigger((prev) => prev + 1)}
      />
    </div>
  );
}

export default App;
