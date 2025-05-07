import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, useBox, useSphere, useCylinder } from "@react-three/cannon";
import { useRef, useState } from "react";
import * as THREE from "three";

interface Ball {
  position: THREE.Vector3;
}

function PlinkoGame() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const canvasRef = useRef(null);

  const addBall = () => {
    const newBall: Ball = {
      position: new THREE.Vector3(
        Math.random() * 2 - 1,
        5,
        Math.random() * 2 - 1,
      ),
    };
    setBalls((prevBalls) => [...prevBalls, newBall]);
  };

  return (
    <>
      <Canvas ref={canvasRef} camera={{ position: [0, 5, 5] }}>
        <Physics gravity={[0, -9.8, 0]}>
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {balls.map((ball, index) => (
            <Ball key={index} position={ball.position} />
          ))}
          <Ground position={[0, -2, 0]} scale={[2, 0.1, 2]} />
          <Pegs />
        </Physics>
      </Canvas>
      <button onClick={addBall}>Add Ball</button>
    </>
  );
}

function Pegs() {
  const pegPositions = [
    [-0.5, 0, 0],
    [0.5, 0, 0],
    [-0.25, -0.5, 0],
    [0.25, -0.5, 0],
    [0, -1, 0],
  ];

  return (
    <>
      {pegPositions.map((position, index) => (
        <Peg key={index} position={position} />
      ))}
    </>
  );
}

function Peg({ position }) {
  const [ref] = useCylinder(() => ({
    type: "Static",
    mass: 0,
    position: [position[0], position[1], position[2]],
    args: [0.05, 0.2],
  }));

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.05, 0.05, 0.2, 32]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

function Ball({ position }) {
  const [ref] = useSphere(() => ({
    mass: 1,
    position: [position.x, position.y, position.z],
    args: [0.1],
  }));

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function Ground({ position, scale }) {
  const [ref] = useBox(() => ({
    type: "Static",
    mass: 0,
    position: [position.x, position.y, position.z],
    args: [scale.x, scale.y, scale.z],
  }));

  return (
    <mesh ref={ref} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

export default PlinkoGame;
