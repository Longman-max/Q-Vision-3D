import { useState, useEffect, useRef, useCallback } from 'react';
import { QLearningAgent, QLearningConfig, State } from '../lib/rl/QLearningAgent';
import { GRID_SIZE, START_POS, GOAL_POS, HAZARDS } from '../config/level';

const INITIAL_CONFIG: QLearningConfig = {
  alpha: 0.1,
  gamma: 0.9,
  epsilon: 0.1,
  trainingMode: false
};

export interface RLStats {
  episode: number;
  step: number;
  totalReward: number;
  wins: number;
  history: number[]; // History of total rewards per episode
}

export const useQLearning = () => {
  // RL State
  const agentRef = useRef(new QLearningAgent(INITIAL_CONFIG));
  const [agentPosition, setAgentPosition] = useState<[number, number]>(START_POS);
  const [config, setConfig] = useState<QLearningConfig>(INITIAL_CONFIG);
  
  // Simulation State
  const [simulationSpeed, setSimulationSpeed] = useState(100); // ms
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState<RLStats>({
    episode: 1,
    step: 0,
    totalReward: 0,
    wins: 0,
    history: []
  });

  // Helper to get state string
  const getState = (pos: [number, number]): State => `${pos[0]},${pos[1]}`;

  // Reset Episode
  const resetEpisode = useCallback(() => {
    setAgentPosition(START_POS);
    setStats(prev => ({
      ...prev,
      episode: prev.episode + 1,
      step: 0,
      totalReward: 0,
      history: [...prev.history, prev.totalReward]
    }));
  }, []);

  // Full Reset
  const handleReset = useCallback(() => {
    agentRef.current.reset();
    setStats({
      episode: 1,
      step: 0,
      totalReward: 0,
      wins: 0,
      history: []
    });
    setAgentPosition(START_POS);
    setIsPaused(false);
  }, []);

  // Update Agent Config
  const handleConfigChange = useCallback((newConfig: Partial<QLearningConfig>) => {
    setConfig(prev => {
        const updated = { ...prev, ...newConfig };
        agentRef.current.updateConfig(updated);
        return updated;
    });
  }, []);

  // Single Step Logic
  const step = useCallback(() => {
    const currentPos = agentPosition;
    const currentState = getState(currentPos);
    
    // 1. Choose Action
    const action = agentRef.current.chooseAction(currentState);
    
    // 2. Perform Action (Move)
    let nextRow = currentPos[0];
    let nextCol = currentPos[1];
    
    // 0: Up, 1: Right, 2: Down, 3: Left
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
  }, [agentPosition, resetEpisode]);

  // Game Loop
  useEffect(() => {
    if (isPaused) return;

    const loop = () => {
        step();
    };

    let interval: ReturnType<typeof setInterval>;

    if (config.trainingMode) {
        interval = setInterval(loop, 1); 
    } else {
        interval = setInterval(loop, simulationSpeed);
    }

    return () => clearInterval(interval);
  }, [isPaused, step, simulationSpeed, config.trainingMode]);

  return {
    agentPosition,
    gridSize: GRID_SIZE,
    goalPosition: GOAL_POS,
    hazards: HAZARDS,
    agent: agentRef.current,
    stats,
    config,
    simulationSpeed,
    setSimulationSpeed,
    handleReset,
    handleConfigChange,
    isPaused,
    setIsPaused,
    step
  };
};
