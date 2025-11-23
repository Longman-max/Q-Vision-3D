import { useState, useEffect } from 'react';
import { Github, Info, X } from 'lucide-react';

import { GridWorld } from './components/World/GridWorld';
import { Dashboard } from './components/UI/Dashboard';
import { useQLearning } from './hooks/useQLearning';

function App() {
  const [showInfo, setShowInfo] = useState(false);
  
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showInfo) {
        setShowInfo(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
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
    step
  } = useQLearning();

  return (
    <div className="relative w-full h-[100dvh] bg-[#000000] overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-30 p-4 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-xl border border-teal-700/50 shadow-xl pointer-events-auto w-fit flex items-center gap-6">
          <h1 className="text-white font-bold text-xl leading-none">Q-Vision 3D</h1>
          
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
                  Q-Vision 3D is an interactive 3D visualization of Q-Learning reinforcement learning in action. 
                  Watch a wooden robot agent learn to navigate a grid world, avoid hazards, and reach its goal through trial and error.
                </p>
              </section>

              {/* Controls */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-3">Controls</h3>
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
                    <span className="text-slate-400">Reset:</span>
                    <span className="font-mono">Click Reset Agent</span>
                  </div>
                </div>
              </section>

              {/* Stats Explanation */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-3">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-white">Episode:</span>
                    <span className="ml-2">Number of complete training runs (goal reached or hazard hit).</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Step:</span>
                    <span className="ml-2">Current number of moves in the current episode.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Reward:</span>
                    <span className="ml-2">Cumulative reward for the current episode (+10 goal, -10 hazard, -0.01 per step).</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Wins:</span>
                    <span className="ml-2">Total successful episodes where the agent reached the goal.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Reward History:</span>
                    <span className="ml-2">Chart showing total reward for each completed episode.</span>
                  </div>
                </div>
              </section>

              {/* Hyperparameters */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-3">Hyperparameters</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-white">Learning Rate (α):</span>
                    <span className="ml-2">How much new information overrides old (0-1). Higher = faster learning.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Discount Factor (γ):</span>
                    <span className="ml-2">Importance of future rewards (0-1). Higher = more long-term planning.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Exploration (ε):</span>
                    <span className="ml-2">Probability of random action (0-1). Higher = more exploration vs exploitation.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Simulation Speed:</span>
                    <span className="ml-2">Delay between steps in milliseconds (10-500ms). Lower = faster simulation.</span>
                  </div>
                </div>
              </section>

              {/* Visual Elements */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-3">Visual Elements</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded bg-[#4FB477] mt-0.5"></div>
                    <div>
                      <span className="font-semibold text-white">Green Tile:</span>
                      <span className="ml-2">Goal position (+10 reward)</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded bg-[#DD4B39] mt-0.5"></div>
                    <div>
                      <span className="font-semibold text-white">Red Tile:</span>
                      <span className="ml-2">Hazard (-10 reward)</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded bg-white border border-slate-700 mt-0.5"></div>
                    <div>
                      <span className="font-semibold text-white">White Arrows:</span>
                      <span className="ml-2">Show learned policy (best action direction)</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Training Mode */}
              <section>
                <h3 className="text-lg font-bold text-teal-400 mb-2">Training Mode</h3>
                <p className="text-sm leading-relaxed">
                  Enable to maximize learning speed by disabling rendering delays. The agent will train much faster, 
                  but you won't see individual moves. Useful for quick convergence to optimal policy.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 w-full h-full">
        <GridWorld
          agentPosition={agentPosition}
          gridSize={gridSize}
          goalPosition={goalPosition}
          hazards={hazards}
          agent={agent}
          episode={stats.episode}
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
      />
    </div>
  );
}

export default App;
