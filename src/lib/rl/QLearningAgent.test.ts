import { describe, it, expect, beforeEach } from 'vitest';
import { QLearningAgent, QLearningConfig } from './QLearningAgent';

describe('QLearningAgent', () => {
  let agent: QLearningAgent;
  let config: QLearningConfig;

  beforeEach(() => {
    config = {
      alpha: 0.1,
      gamma: 0.9,
      epsilon: 0.1,
      trainingMode: false
    };
    agent = new QLearningAgent(config);
  });

  it('should initialize with empty Q-table', () => {
    expect(agent.getQTable().size).toBe(0);
  });

  it('should initialize Q-values for a new state with zeros', () => {
    const qValues = agent.getQValues('0,0');
    expect(qValues).toHaveLength(4);
    expect(qValues.every(v => v === 0)).toBe(true);
  });

  it('should update Q-values when learning', () => {
    const state = '0,0';
    const action = 1;
    const reward = 10;
    const nextState = '0,1';

    // Initial Q(s,a) is 0
    // Q(s,a) = Q(s,a) + alpha * (reward + gamma * maxQ(s') - Q(s,a))
    //        = 0 + 0.1 * (10 + 0.9 * 0 - 0)
    //        = 1
    
    agent.learn(state, action, reward, nextState);
    
    const qValues = agent.getQValues(state);
    expect(qValues[action]).toBeCloseTo(1);
  });

  it('should choose an action within valid range', () => {
    const action = agent.chooseAction('0,0');
    expect(action).toBeGreaterThanOrEqual(0);
    expect(action).toBeLessThan(4);
  });

  it('should respect epsilon for exploration', () => {
    // Set epsilon to 1 (always explore)
    agent.updateConfig({ epsilon: 1 });
    // We can't deterministically test randomness, but we can check it runs
    const action = agent.chooseAction('0,0');
    expect(action).toBeDefined();
  });

  it('should respect epsilon for exploitation', () => {
    // Set epsilon to 0 (always exploit)
    agent.updateConfig({ epsilon: 0 });
    
    // Set a high Q value for action 2
    const state = '0,0';
    agent.getQValues(state)[2] = 100;
    
    const action = agent.chooseAction(state);
    expect(action).toBe(2);
  });

  it('should reset the Q-table', () => {
    agent.learn('0,0', 1, 10, '0,1');
    expect(agent.getQTable().size).toBeGreaterThan(0);
    
    agent.reset();
    expect(agent.getQTable().size).toBe(0);
  });
});
