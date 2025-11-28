"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { Boiler } from './components/Boiler';
import { Turbine } from './components/Turbine';
import { Generator } from './components/Generator';
import { CoolingTower } from './components/CoolingTower';
import { CoalConveyor } from './components/CoalConveyor';
import { Pipes } from './components/Pipes';
import { CoalParticles } from './visuals/CoalParticles';
import { FlameParticles } from './visuals/FlameParticles';
import { SteamParticles } from './visuals/SteamParticles';
import { ElectricityFlow } from './visuals/ElectricityFlow';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function ThermalScene() {
    return (
        <Canvas
            className="w-full h-full block"
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            shadows
            dpr={[1, 2]}
        >
            <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[5, 12, 25]} fov={55} />
                <OrbitControls
                    makeDefault
                    target={[-5, 4, 0]}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 2.1}
                    maxDistance={60}
                    minDistance={5}
                    enableDamping
                    dampingFactor={0.05}
                />

                {/* Lighting & Environment */}
                <ambientLight intensity={0.8} />
                <directionalLight
                    position={[30, 40, 20]}
                    intensity={2.5}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-left={-40}
                    shadow-camera-right={40}
                    shadow-camera-top={40}
                    shadow-camera-bottom={-40}
                />
                <pointLight position={[-15, 15, -15]} intensity={1.5} color="#00ffff" distance={60} />
                <pointLight position={[15, 15, 15]} intensity={1.5} color="#ffaa00" distance={60} />
                <hemisphereLight args={["#87CEEB", "#1e293b", 0.5]} />

                {/* Softer night environment */}
                <Environment preset="sunset" blur={0.5} background backgroundIntensity={0.3} />
                <color attach="background" args={["#0a0f1a"]} />

                {/* Ground */}
                <Grid
                    infiniteGrid
                    fadeDistance={120}
                    fadeStrength={3}
                    cellColor="#1e3a5f"
                    sectionColor="#3b5a7f"
                    sectionSize={5}
                    cellSize={1}
                />
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                    <planeGeometry args={[200, 200]} />
                    <meshStandardMaterial color="#0d1b2a" roughness={0.9} metalness={0.1} />
                </mesh>

                {/* Plant Components */}
                <group position={[-10, 0, 0]}>
                    <CoalConveyor position={[-8, 0, 0]} />
                    <Boiler position={[0, 0, 0]} />
                    <Pipes />
                    <Turbine position={[8, 0, 0]} />
                    <Generator position={[14, 0, 0]} />
                    <CoolingTower position={[20, 0, -10]} />
                </group>

                {/* Visual Effects */}
                <group position={[-10, 0, 0]}>
                    <CoalParticles position={[-8, 1, 0]} />
                    <FlameParticles position={[0, 4, 0]} />
                    <SteamParticles />
                    <ElectricityFlow />
                </group>

                <EffectComposer>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
                </EffectComposer>
            </Suspense>
        </Canvas>
    );
}
