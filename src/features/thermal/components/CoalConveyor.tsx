import React from 'react';

export function CoalConveyor(props: any) {
    return (
        <group {...props}>
            {/* Belt Structure */}
            <mesh position={[0, 1, 0]} rotation={[0, 0, -0.2]} castShadow>
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
