import React, { useRef } from 'react';
import { useThermalStore, SimulationStep } from '@/store/thermalStore';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Generator(props: any) {
    const meshRef = useRef<THREE.Group>(null);
    const currentStep = useThermalStore((state) => state.currentStep);

    useFrame((state) => {
        if (meshRef.current) {
            const isStepActive = currentStep === SimulationStep.POWER_GENERATION;

            meshRef.current.children.forEach((child: any) => {
                if (child.isMesh && child.material) {
                    const baseColor = new THREE.Color(child.userData.originalColor || "#475569");
                    if (!child.userData.originalColor) child.userData.originalColor = baseColor.getHexString();

                    if (isStepActive) {
                        const pulse = (Math.sin(state.clock.elapsedTime * 4) + 1) * 0.5;
                        const highlightColor = new THREE.Color(0.2, 0.5, 1.0).multiplyScalar(pulse);
                        child.material.emissive.setHex(0x4488ff);
                        child.material.emissiveIntensity = 0.5 + pulse;
                    } else {
                        child.material.emissiveIntensity = 0;
                    }
                }
            });
        }
    });

    return (
        <group
            ref={meshRef}
            {...props}
            onPointerOver={(e) => { e.stopPropagation(); useThermalStore.getState().setHoveredComponent('Electric Generator'); }}
            onPointerOut={(e) => { useThermalStore.getState().setHoveredComponent(null); }}
            onClick={(e) => { e.stopPropagation(); useThermalStore.getState().setSelectedComponent('Electric Generator'); }}
        >
            {/* Stator Housing */}
            <mesh position={[0, 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[5, 5, 6]} />
                <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
            </mesh>

            {/* Cooling Fins */}
            <mesh position={[0, 4.6, 0]}>
                <boxGeometry args={[4, 0.2, 5]} />
                <meshStandardMaterial color="#334155" />
            </mesh>

            {/* Terminals */}
            <mesh position={[0, 3, 3.5]}>
                <boxGeometry args={[3, 2, 1]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
        </group>
    );
}
