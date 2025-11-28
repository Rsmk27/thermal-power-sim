import { useThermalStore, SimulationStep } from '@/store/thermalStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function Pipes(props: any) {
    const mainPipeRef = useRef<THREE.Mesh>(null);
    const currentStep = useThermalStore((state) => state.currentStep);

    useFrame((state) => {
        if (mainPipeRef.current) {
            const isStepActive = currentStep === SimulationStep.STEAM_GENERATION;
            const baseColor = new THREE.Color("#94a3b8");

            if (isStepActive) {
                const pulse = (Math.sin(state.clock.elapsedTime * 4) + 1) * 0.5;
                baseColor.add(new THREE.Color(0.2, 0.2, 0.5).multiplyScalar(pulse));
                (mainPipeRef.current.material as THREE.MeshStandardMaterial).emissive.setHex(0x4466aa);
                (mainPipeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + pulse;
            } else {
                (mainPipeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
            }

            (mainPipeRef.current.material as THREE.MeshStandardMaterial).color.lerp(baseColor, 0.1);
        }
    });

    return (
        <group {...props}>
            {/* Boiler to Turbine (Main Steam) */}
            <mesh ref={mainPipeRef} position={[5, 6, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 6]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>

            {/* Turbine to Condenser/Cooling */}
            <mesh position={[10, 1, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 4]} />
                <meshStandardMaterial color="#64748b" />
            </mesh>

            {/* Cooling Return */}
            <mesh position={[5, 0.5, 2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.2, 0.2, 10]} />
                <meshStandardMaterial color="#475569" />
            </mesh>
        </group>
    );
}
