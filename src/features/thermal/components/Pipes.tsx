import React from 'react';

export function Pipes(props: any) {
    return (
        <group {...props}>
            {/* Boiler to Turbine (Main Steam) */}
            <mesh position={[5, 6, 0]} rotation={[0, 0, Math.PI / 2]}>
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
