import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThermalStore, SimulationStep } from '@/store/thermalStore';
import * as THREE from 'three';

export function Boiler(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    const boilerTemp = useThermalStore((state) => state.boilerTemp);
    const currentStep = useThermalStore((state) => state.currentStep);

    useFrame((state) => {
        if (meshRef.current) {
            // Color interpolation based on temp (300C = dark, 600C = red hot)
            const normalizedTemp = Math.min(Math.max((boilerTemp - 100) / 500, 0), 1);
            const color = new THREE.Color().setHSL(0.05, 1, 0.2 + (normalizedTemp * 0.3));

            // Step highlighting
            const isStepActive = currentStep === SimulationStep.COMBUSTION;
            if (isStepActive) {
                // Pulse effect
                const pulse = (Math.sin(state.clock.elapsedTime * 4) + 1) * 0.5;
                color.add(new THREE.Color(0.2, 0.1, 0).multiplyScalar(pulse));
            }

            (meshRef.current.material as THREE.MeshStandardMaterial).color.lerp(color, 0.1);

            // High emissive intensity for bloom
            const emissiveIntensity = normalizedTemp * 4 + (isStepActive ? 2 : 0);
            (meshRef.current.material as THREE.MeshStandardMaterial).emissive.lerp(new THREE.Color(1, 0.2, 0).multiplyScalar(emissiveIntensity), 0.1);
        }
    });

    return (
        <group {...props}>
            {/* Main Furnace Body */}
            <mesh
                ref={meshRef}
                position={[0, 4, 0]}
                castShadow
                receiveShadow
                onPointerOver={(e) => { e.stopPropagation(); useThermalStore.getState().setHoveredComponent('Boiler Furnace'); }}
                onPointerOut={(e) => { useThermalStore.getState().setHoveredComponent(null); }}
                onClick={(e) => { e.stopPropagation(); useThermalStore.getState().setSelectedComponent('Boiler Furnace'); }}
            >
                <boxGeometry args={[6, 8, 6]} />
                <meshStandardMaterial color="#334155" />
            </mesh>

            {/* Chimney */}
            <mesh position={[0, 9, 0]} castShadow>
                <cylinderGeometry args={[1, 1.5, 4]} />
                <meshStandardMaterial color="#475569" />
            </mesh>
        </group>
    );
}
