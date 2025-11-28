import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThermalStore } from '@/store/thermalStore';
import * as THREE from 'three';

export function Boiler(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    const boilerTemp = useThermalStore((state) => state.boilerTemp);

    useFrame(() => {
        if (meshRef.current) {
            // Color interpolation based on temp (300C = dark, 600C = red hot)
            const normalizedTemp = Math.min(Math.max((boilerTemp - 100) / 500, 0), 1);
            const color = new THREE.Color().setHSL(0.05, 1, 0.2 + (normalizedTemp * 0.3));
            (meshRef.current.material as THREE.MeshStandardMaterial).color.lerp(color, 0.1);
            // High emissive intensity for bloom
            (meshRef.current.material as THREE.MeshStandardMaterial).emissive.lerp(new THREE.Color(1, 0.2, 0).multiplyScalar(normalizedTemp * 4), 0.1);
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
