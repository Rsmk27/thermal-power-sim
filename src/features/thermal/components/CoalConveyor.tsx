import { useThermalStore, SimulationStep } from '@/store/thermalStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function CoalConveyor(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    const currentStep = useThermalStore((state) => state.currentStep);

    useFrame((state) => {
        if (meshRef.current) {
            const isStepActive = currentStep === SimulationStep.COAL_HANDLING;
            const baseColor = new THREE.Color("#334155");

            if (isStepActive) {
                const pulse = (Math.sin(state.clock.elapsedTime * 4) + 1) * 0.5;
                baseColor.add(new THREE.Color(0.1, 0.1, 0.2).multiplyScalar(pulse));
                (meshRef.current.material as THREE.MeshStandardMaterial).emissive.setHex(0x224466);
                (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + pulse;
            } else {
                (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
            }

            (meshRef.current.material as THREE.MeshStandardMaterial).color.lerp(baseColor, 0.1);
        }
    });

    return (
        <group {...props}>
            {/* Belt Structure */}
            <mesh ref={meshRef} position={[0, 1, 0]} rotation={[0, 0, -0.2]} castShadow>
                <boxGeometry args={[12, 0.5, 2]} />
                <meshStandardMaterial color="#334155" />
            </mesh>

            {/* Supports */}
            <mesh position={[-5, -1, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 4]} />
                <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 2]} />
                <meshStandardMaterial color="#64748b" />
            </mesh>
        </group>
    );
}
