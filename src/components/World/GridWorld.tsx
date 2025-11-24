import React, { useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

import { QLearningAgent } from '../../lib/rl/QLearningAgent';

interface GridWorldProps {
  agentPosition: [number, number]; // [row, col]
  gridSize: number;
  goalPosition: [number, number];
  hazards: [number, number][];
  agent: QLearningAgent;
  episode: number;
  autoRotate: boolean;
  resetCameraTrigger: number;
}

const WoodenRobot: React.FC = () => {
  const woodMaterial = <meshStandardMaterial color="#8D6E63" roughness={0.8} metalness={0.1} />;

  return (
    <group position={[0, 0.3, 0]}>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.35, 0.2]} />
        {woodMaterial}
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        {woodMaterial}
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.05, 0.52, 0.08]} castShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="black" roughness={0.2} />
      </mesh>
      <mesh position={[0.05, 0.52, 0.08]} castShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="black" roughness={0.2} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.2, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.3]} />
        {woodMaterial}
      </mesh>
      <mesh position={[0.2, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.3]} />
        {woodMaterial}
      </mesh>

      {/* Legs */}
      <mesh position={[-0.08, -0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        {woodMaterial}
      </mesh>
      <mesh position={[0.08, -0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        {woodMaterial}
      </mesh>
    </group>
  );
};

const Arrow: React.FC<{ direction: number }> = ({ direction }) => {
  // direction: 0: Up, 1: Right, 2: Down, 3: Left
  
  return (
    <group rotation={[0, -direction * (Math.PI / 2), 0]}>
        {/* Arrow shape */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} castShadow>
            <coneGeometry args={[0.15, 0.3, 3]} /> {/* Triangle, slightly larger */}
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} roughness={0.1} />
        </mesh>
    </group>
  );
};

const Tile: React.FC<{
  position: [number, number, number];
  baseColor: string;
  isAgent?: boolean;
  isGoal?: boolean;
  isHazard?: boolean;
  qValues?: number[];
}> = ({ position, baseColor, isAgent, isGoal, isHazard, qValues }) => {
  
  // Calculate color based on Q-value
  const { tileColor, bestAction } = useMemo(() => {
    let color = baseColor;
    let action = -1;
    
    if (isGoal) return { tileColor: '#10b981', bestAction: -1 }; // Green
    if (isGoal) return { tileColor: '#4FB477', bestAction: -1 }; // Goal green
    if (isHazard) return { tileColor: '#DD4B39', bestAction: -1 }; // Penalty red
    
    if (qValues) {
        const maxQ = Math.max(...qValues);
        // Normalize Q roughly between -1 and 1 for visualization (clamped)
        // Assuming rewards are roughly -100 to 100
        const intensity = Math.min(Math.abs(maxQ) / 10, 1); 
        
        if (maxQ > 0) {
            // Mix base color with green
            color = new THREE.Color(baseColor).lerp(new THREE.Color('#34d399'), intensity * 0.5).getStyle();
        } else {
            // Mix base color with red
            color = new THREE.Color(baseColor).lerp(new THREE.Color('#f87171'), intensity * 0.5).getStyle();
        }

        // Determine best action for arrow
        // Only show arrow if maxQ is significantly better than others or positive
        // And not all zero
        if (maxQ !== 0 || qValues.some(q => q !== 0)) {
             const bestActions = qValues.map((q, i) => q === maxQ ? i : -1).filter(i => i !== -1);
             if (bestActions.length === 1) {
                 action = bestActions[0];
             }
        }
    }
    return { tileColor: color, bestAction: action };
  }, [baseColor, isGoal, isHazard, qValues]);

  return (
    <group position={position}>
      <Box args={[0.95, 0.1, 0.95]} position={[0, -0.05, 0]} receiveShadow>
        <meshStandardMaterial color={tileColor} roughness={0.9} metalness={0.0} />
      </Box>
      
      {/* Action Arrow */}
      {bestAction !== -1 && <Arrow direction={bestAction} />}
      
      {/* Agent */}
      {isAgent && <WoodenRobot />}

      {/* Goal */}
      {isGoal && (
        <group position={[0, 0.25, 0]}>
            <mesh castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.5} roughness={0.2} metalness={0.5} />
            </mesh>
            <Text position={[0, 0.4, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
                GOAL
            </Text>
        </group>
      )}

      {/* Hazard */}
      {isHazard && (
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.3, 0.4, 32]} />
          <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.5} />
        </mesh>
      )}
    </group>
  );
};

// Component to handle responsive camera adjustments
const ResponsiveCamera: React.FC<{ 
    controlsRef: React.RefObject<any>, 
    resetTrigger: number 
}> = ({ controlsRef, resetTrigger }) => {
  const { camera } = useThree();

  // Handle Resize and Initial Position
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
          // Mobile: Tilted view from above-front to show grid clearly above control panel
          // Position creates the perfect angle shown in the reference screenshot
          camera.position.set(0, 20, 22);
          if (controlsRef.current) {
              controlsRef.current.target.set(0, 0, 6); // Look forward to push grid higher in viewport
              controlsRef.current.update();
          }
      } else {
          // Desktop: Standard view
          camera.position.set(0, 12, 12);
          if (controlsRef.current) {
              controlsRef.current.target.set(0, 0, 0);
              controlsRef.current.update();
          }
      }
    };

    // Initial set
    // Small timeout to ensure controls are ready
    setTimeout(handleResize, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, controlsRef]);

  // Handle Reset Trigger
  useEffect(() => {
      if (resetTrigger > 0) {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            camera.position.set(0, 20, 22);
            if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 6);
                controlsRef.current.update();
            }
        } else {
            camera.position.set(0, 12, 12);
            if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.update();
            }
        }
      }
  }, [resetTrigger, camera, controlsRef]);

  return null;
};

export const GridWorld: React.FC<GridWorldProps> = ({
  agentPosition,
  gridSize,
  goalPosition,
  hazards,
  agent,
  episode,
  autoRotate,
  resetCameraTrigger
}) => {
  const orbitControlsRef = React.useRef<any>(null);

  // Generate grid tiles
  const tiles = useMemo(() => {
    const grid: JSX.Element[] = [];
    const qTable = agent.getQTable();

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const isAgent = row === agentPosition[0] && col === agentPosition[1];
        const isGoal = row === goalPosition[0] && col === goalPosition[1];
        const isHazard = hazards.some(h => h[0] === row && h[1] === col);
        
        // MuJoCo-style checkerboard: dark and light green tones
        const isWhite = (row + col) % 2 === 0;
        const baseColor = isWhite ? '#E8F1E8' : '#0A0A0A'; // Light green and dark
        
        // Get Max Q for this state
        const state = `${row},${col}`;
        const qValues = qTable.get(state);

        grid.push(
          <Tile
            key={`${row}-${col}`}
            position={[col - gridSize / 2 + 0.5, 0, row - gridSize / 2 + 0.5]}
            baseColor={baseColor}
            isAgent={isAgent}
            isGoal={isGoal}
            isHazard={isHazard}
            qValues={qValues}
          />
        );
      }
    }
    return grid;
  }, [agentPosition, gridSize, goalPosition, hazards, agent, episode]); // Re-render on episode/agent move to update Q-colors

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 12, 12], fov: 50 }} dpr={[1, 2]}>
        <ResponsiveCamera controlsRef={orbitControlsRef} resetTrigger={resetCameraTrigger} />
        <color attach="background" args={['#000000']} />
        {/* No fog for pure black aesthetic */}
        
        <ambientLight intensity={0.15} color="#888888" />
        <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.0} 
            color="#FFFFFF"
            castShadow 
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
        >
            <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
        </directionalLight>
        
        <Environment preset="city" />
        <OrbitControls 
            ref={orbitControlsRef} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.2} 
            autoRotate={autoRotate}
            autoRotateSpeed={2.0}
        />
        
        <group position={[0, -0.1, 0]}>
             {/* Grid Helper for professional 3D look */}
             <gridHelper args={[50, 50, 0x444444, 0x222222]} position={[0, -0.01, 0]} />
            {tiles}
        </group>
      </Canvas>
    </div>
  );
};
