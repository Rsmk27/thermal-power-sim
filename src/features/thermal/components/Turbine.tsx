import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThermalStore, SimulationStep } from '@/store/thermalStore';
import * as THREE from 'three';

export function Turbine(props: any) {
    const shaftRef = useRef<THREE.Group>(null);
    const casingRef = useRef<THREE.Group>(null);
    const turbineRPM = useThermalStore((state) => state.turbineRPM);
    const currentStep = useThermalStore((state) => state.currentStep);

    useFrame((state, delta) => {
        if (shaftRef.current) {
            // Rotate based on RPM (RPM / 60 * 2PI * delta)
            // Scaling down visual speed so it doesn't look like a blur
            const rotationSpeed = (turbineRPM / 60) * Math.PI * 2 * delta * 0.1;
            shaftRef.current.rotation.x += rotationSpeed;
        }

        if (casingRef.current) {
            const isStepActive = currentStep === SimulationStep.TURBINE_ROTATION;

            casingRef.current.children.forEach((child: any) => {
                if (child.isMesh && child.material) {
                    const baseColor = new THREE.Color("#64748b");
                    if (isStepActive) {
                        const pulse = (Math.sin(state.clock.elapsedTime * 4) + 1) * 0.5;
                        baseColor.add(new THREE.Color(0.2, 0.2, 0.5).multiplyScalar(pulse));
                        child.material.emissive.setHex(0x4466aa);
                        child.material.emissiveIntensity = 0.5 + pulse;
                    } else {
                        child.material.emissiveIntensity = 0;
                    }
                    child.material.color.lerp(baseColor, 0.1);
                }
            });
        }
    });

    return (
        <group
            {...props}
            onPointerOver={(e) => { e.stopPropagation(); useThermalStore.getState().setHoveredComponent('Steam Turbine'); }}
            onPointerOut={(e) => { useThermalStore.getState().setHoveredComponent(null); }}
            onClick={(e) => { e.stopPropagation(); useThermalStore.getState().setSelectedComponent('Steam Turbine'); }}
        >
            {/* Turbine Casing - Multi-stage */}
            <group ref={casingRef} position={[0, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
                {/* High Pressure (HP) Stage */}
                <mesh position={[-2.5, 0, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[1.2, 1.2, 2]} />
                    <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Intermediate Pressure (IP) Stage */}
                <mesh position={[0, 0, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[1.8, 1.8, 2.5]} />
                    <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Low Pressure (LP) Stage */}
                <mesh position={[3, 0, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[2.5, 2.5, 3]} />
                    <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
                </mesh>

                {/* Connecting Flanges */}
                <mesh position={[-1.2, 0, 0]}>
                    <cylinderGeometry args={[1.4, 1.4, 0.2]} />
                    <meshStandardMaterial color="#475569" />
                </mesh>
                <mesh position={[1.4, 0, 0]}>
                    <cylinderGeometry args={[2.0, 2.0, 0.2]} />
                    <meshStandardMaterial color="#475569" />
                </mesh>
            </group>

            {/* Rotating Shaft (Visible at ends) */}
            <group ref={shaftRef} position={[0, 2, 0]}>
                <mesh position={[5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.4, 0.4, 12]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0.1} />
                </mesh>
            </group>
        </group>
    );
}
