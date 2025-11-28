import React from 'react';
import { useThermalStore } from '@/store/thermalStore';

export function CoolingTower(props: any) {
    return (
        <group
            {...props}
            onPointerOver={(e) => { e.stopPropagation(); useThermalStore.getState().setHoveredComponent('Cooling Tower'); }}
            onPointerOut={(e) => { useThermalStore.getState().setHoveredComponent(null); }}
            onClick={(e) => { e.stopPropagation(); useThermalStore.getState().setSelectedComponent('Cooling Tower'); }}
        >
            {/* Hyperboloid shape approximation using a tapered cylinder */}
            <mesh position={[0, 5, 0]} castShadow receiveShadow>
                {/* Top radius, Bottom radius, Height, Segments */}
                <cylinderGeometry args={[2.5, 4.5, 10, 32, 1, true]} />
                <meshStandardMaterial color="#cbd5e1" side={2} roughness={0.9} />
            </mesh>

            {/* Concrete Base */}
            <mesh position={[0, 0.5, 0]} receiveShadow>
                <cylinderGeometry args={[4.6, 4.8, 1, 32]} />
                <meshStandardMaterial color="#64748b" />
            </mesh>

            {/* Steam/Vapor Effect (Static for now, could be particles) */}
            <mesh position={[0, 10, 0]}>
                <sphereGeometry args={[2, 16, 16]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </mesh>
        </group>
    );
}
