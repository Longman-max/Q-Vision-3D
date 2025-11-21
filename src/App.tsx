import { useState, useEffect, useRef, useCallback } from 'react';
import { Github } from 'lucide-react';

import { GridWorld } from './components/World/GridWorld';
import { Dashboard } from './components/UI/Dashboard';
import { QLearningAgent, QLearningConfig } from './lib/rl/QLearningAgent';

const GRID_SIZE = 10;
const START_POS: [number, number] = [0, 0];
const GOAL_POS: [number, number] = [9, 9];
const HAZARDS: [number, number][] = [
  [2, 2], [2, 3], [2, 4],
  [5, 5], [5, 6], [4, 6],
  [7, 1], [7, 2], [8, 2]
];

const INITIAL_CONFIG: QLearningConfig = {
  alpha: 0.1,
  gamma: 0.9,
  epsilon: 0.1,
};

function App() {
  // RL State
  const agentRef = useRef(new QLearningAgent(INITIAL_CONFIG));
  const [agentPosition, setAgentPosition] = useState<[number, number]>(START_POS);
  const [config, setConfig] = useState<QLearningConfig>(INITIAL_CONFIG);
  
  // Simulation State
  const [simulationSpeed, setSimulationSpeed] = useState(100); // ms
  const [stats, setStats] = useState({
    episode: 1,
    step: 0,
    totalReward: 0,
    wins: 0,
  });

  // Helper to get state string
  const getState = (pos: [number, number]) => `${pos[0]},${pos[1]}`;

  // Reset Episode
  const resetEpisode = useCallback(() => {
    setAgentPosition(START_POS);
    setStats(prev => ({
      ...prev,
      episode: prev.episode + 1,
      step: 0,
      totalReward: 0
    }));
  }, []);

  // Full Reset
  const handleReset = () => {
    agentRef.current.reset();
    setStats({
      episode: 1,
      step: 0,
      totalReward: 0,
      wins: 0
    });
    setAgentPosition(START_POS);
  };

  // Update Agent Config
  const handleConfigChange = (newConfig: Partial<QLearningConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    agentRef.current.updateConfig(updated);
  };

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPos = agentPosition;
      const currentState = getState(currentPos);
      
      // 1. Choose Action
      const action = agentRef.current.chooseAction(currentState);
      
      // 2. Perform Action (Move)
      let nextRow = currentPos[0];
      let nextCol = currentPos[1];
      
      // 0: Up (row - 1), 1: Right (col + 1), 2: Down (row + 1), 3: Left (col - 1)
      // Note: In 3D grid, let's map:
      // Up (-z) -> row - 1
      // Down (+z) -> row + 1
      // Left (-x) -> col - 1
      // Right (+x) -> col + 1
      
      if (action === 0) nextRow = Math.max(0, nextRow - 1);
      if (action === 1) nextCol = Math.min(GRID_SIZE - 1, nextCol + 1);
      if (action === 2) nextRow = Math.min(GRID_SIZE - 1, nextRow + 1);
      if (action === 3) nextCol = Math.max(0, nextCol - 1);
      
      const nextPos: [number, number] = [nextRow, nextCol];
      const nextState = getState(nextPos);
      
      // 3. Calculate Reward
      let reward = -0.1; // Living penalty
      let done = false;
      let win = false;

      // Check Goal
      if (nextRow === GOAL_POS[0] && nextCol === GOAL_POS[1]) {
        reward = 100;
        done = true;
        win = true;
      }
      // Check Hazards
      else if (HAZARDS.some(h => h[0] === nextRow && h[1] === nextCol)) {
        reward = -100;
        done = true;
      }

      // 4. Learn
      agentRef.current.learn(currentState, action, reward, nextState);
      
      // 5. Update State
      setAgentPosition(nextPos);
      setStats(prev => ({
        ...prev,
        step: prev.step + 1,
        totalReward: prev.totalReward + reward,
        wins: win ? prev.wins + 1 : prev.wins
      }));

      if (done) {
        resetEpisode();
      }

    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [agentPosition, simulationSpeed, resetEpisode]);

  return (
    <div className="relative w-full h-[100dvh] bg-gray-200 overflow-hidden flex flex-col md:block">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-30 p-4 flex justify-between items-start pointer-events-none">
        <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-xl border border-gray-700 shadow-xl pointer-events-auto">
          <h1 className="text-white font-bold text-lg leading-none">Q-Vision 3D</h1>
          <p className="text-gray-400 text-xs mt-1">RL Gym 3D</p>
        </div>

        <a 
          href="https://github.com/Longman-max/Q-Vision-3D" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gray-900/80 backdrop-blur-md p-3 rounded-xl border border-gray-700 shadow-xl pointer-events-auto text-white hover:bg-gray-800 transition-colors group"
          title="View Source on GitHub"
        >
          <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </a>
      </div>

      <div className="flex-1 relative w-full min-h-0 md:absolute md:inset-0 md:h-full">
        <GridWorld
          agentPosition={agentPosition}
          gridSize={GRID_SIZE}
          goalPosition={GOAL_POS}
          hazards={HAZARDS}
          agent={agentRef.current}
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
      />
    </div>
  );
}

export default App;
