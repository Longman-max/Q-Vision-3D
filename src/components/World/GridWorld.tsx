import { useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

import { QLearningAgent } from '../../lib/rl/QLearningAgent';

interface GridWorldProps {
  agentPosition: [number, number]; // [row, col]
  gridSize: number;
  goalPosition: [number, number];
  hazards: [number, number][];
  agent: QLearningAgent;
  episode: number;
}

const WoodenRobot: React.FC = () => {
  const woodMaterial = <meshStandardMaterial color="#8D6E63" roughness={0.8} metalness={0.1} />;


  return (
    <group position={[0, 0.3, 0]}>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.35, 0.2]} />
        {woodMaterial}
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        {woodMaterial}
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.05, 0.52, 0.08]} castShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.05, 0.52, 0.08]} castShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.2, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.3]} />
        {woodMaterial}
      </mesh>
      <mesh position={[0.2, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.3]} />
        {woodMaterial}
      </mesh>

      {/* Legs */}
      <mesh position={[-0.08, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        {woodMaterial}
      </mesh>
      <mesh position={[0.08, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        {woodMaterial}
      </mesh>
    </group>
  );
};

const Tile: React.FC<{
  position: [number, number, number];
  color: string;
  isAgent?: boolean;
  isGoal?: boolean;
  isHazard?: boolean;
}> = ({ position, color, isAgent, isGoal, isHazard }) => {
  return (
    <group position={position}>
      <Box args={[0.95, 0.1, 0.95]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </Box>
      
      {/* Agent */}
      {isAgent && <WoodenRobot />}

      {/* Goal */}
      {isGoal && (
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.2} roughness={0.2} metalness={0.5} />
        </mesh>
      )}

      {/* Hazard */}
      {isHazard && (
        <mesh position={[0, 0.1, 0]} castShadow>
          <coneGeometry args={[0.3, 0.4, 32]} />
          <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.5} />
        </mesh>
      )}
    </group>
  );
};

// Component to handle responsive camera adjustments
const ResponsiveCamera: React.FC = () => {
  const { camera } = useThree();

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      // Move camera back and up on mobile to see more of the grid
      const targetPos = isMobile ? [0, 12, 12] : [0, 8, 8];
      camera.position.set(targetPos[0], targetPos[1], targetPos[2]);
      camera.lookAt(0, 0, 0);
    };

    // Initial set
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);

  return null;
};

export const GridWorld: React.FC<GridWorldProps> = ({
  agentPosition,
  gridSize,
  goalPosition,
  hazards,
  agent,
  episode
}) => {
  
  // Generate grid tiles
  const tiles = useMemo(() => {
    const grid: JSX.Element[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const isAgent = row === agentPosition[0] && col === agentPosition[1];
        const isGoal = row === goalPosition[0] && col === goalPosition[1];
        const isHazard = hazards.some(h => h[0] === row && h[1] === col);
        
        // Chessboard pattern
        const isWhite = (row + col) % 2 === 0;
        const color = isWhite ? '#ffffff' : '#1f2937'; // white and gray-800
        
        grid.push(
          <Tile
            key={`${row}-${col}`}
            position={[col - gridSize / 2 + 0.5, 0, row - gridSize / 2 + 0.5]}
            color={color}
            isAgent={isAgent}
            isGoal={isGoal}
            isHazard={isHazard}
          />
        );
      }
    }
    return grid;
  }, [agentPosition, gridSize, goalPosition, hazards, agent, episode]);

  return (
    <div className="w-full h-full bg-gray-200">
      <Canvas shadows camera={{ position: [0, 8, 8], fov: 50 }}>
        <ResponsiveCamera />
        <color attach="background" args={['#e5e7eb']} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
        <hemisphereLight intensity={0.3} groundColor="#000000" />
        <OrbitControls />
        {/* Removed gridHelper as the tiles form the grid now */}
        {tiles}
      </Canvas>
    </div>
  );
};
