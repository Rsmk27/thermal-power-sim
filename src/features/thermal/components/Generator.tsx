import React from 'react';
import { useThermalStore } from '@/store/thermalStore';

export function Generator(props: any) {
    return (
        <group
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
