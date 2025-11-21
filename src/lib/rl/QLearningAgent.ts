export type State = string;
export type Action = number; // 0: Up, 1: Right, 2: Down, 3: Left

export interface QLearningConfig {
  alpha: number; // Learning rate
  gamma: number; // Discount factor
  epsilon: number; // Exploration rate
}

export class QLearningAgent {
  private qTable: Map<State, number[]>;
  private config: QLearningConfig;
  private actions: Action[];

  constructor(config: QLearningConfig, numActions: number = 4) {
    this.config = config;
    this.qTable = new Map();
    this.actions = Array.from({ length: numActions }, (_, i) => i);
  }

  public getQValues(state: State): number[] {
    if (!this.qTable.has(state)) {
      this.qTable.set(state, new Array(this.actions.length).fill(0));
    }
    return this.qTable.get(state)!;
  }

  /**
   * Selects an action using the Epsilon-Greedy strategy.
   * - With probability ε (epsilon): Explore (random action)
   * - With probability 1-ε: Exploit (action with max Q-value)
   * @param state Current state
   */
  public chooseAction(state: State): Action {
    if (Math.random() < this.config.epsilon) {
      // Explore
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else {
      // Exploit
      const qValues = this.getQValues(state);
      const maxQ = Math.max(...qValues);
      const bestActions = this.actions.filter((i) => qValues[i] === maxQ);
      return bestActions[Math.floor(Math.random() * bestActions.length)];
    }
  }

  /**
   * Updates the Q-value for a given state-action pair using the Bellman equation.
   * Formula: Q(s,a) = Q(s,a) + α * [R + γ * max(Q(s',a')) - Q(s,a)]
   * @param state Current state
   * @param action Action taken
   * @param reward Reward received
   * @param nextState Next state resulting from action
   */
  public learn(state: State, action: Action, reward: number, nextState: State): void {
    const currentQ = this.getQValues(state)[action];
    const nextMaxQ = Math.max(...this.getQValues(nextState));
    
    const newQ = currentQ + this.config.alpha * (reward + this.config.gamma * nextMaxQ - currentQ);
    
    this.getQValues(state)[action] = newQ;
  }

  public updateConfig(newConfig: Partial<QLearningConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public reset() {
    this.qTable.clear();
  }
  
  public getConfig() {
      return this.config;
  }
}
