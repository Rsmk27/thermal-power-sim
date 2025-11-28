import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThermalStore } from '@/store/thermalStore';
import * as THREE from 'three';

export function SteamParticles(props: any) {
    const count = 100;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const steamFlowRate = useThermalStore((state) => state.steamFlowRate);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            offset: Math.random(), // Position along the path (0-1)
            speed: 0.1 + Math.random() * 0.1
        }));
    }, []);

    // Simple path: Boiler(0,0,0) -> Up -> Right -> Turbine
    // Path points: [0, 6, 0] -> [5, 6, 0] -> [8, 6, 0] (Turbine inlet)

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const flowSpeed = steamFlowRate / 100; // 0-1

        particles.forEach((particle, i) => {
            particle.offset += particle.speed * flowSpeed * delta;
            if (particle.offset > 1) particle.offset = 0;

            // Interpolate position based on offset
            // Segment 1: 0.0 - 0.3 (Vertical Rise)
            // Segment 2: 0.3 - 1.0 (Horizontal Flow)

            let x = 0, y = 0, z = 0;

            if (particle.offset < 0.3) {
                // Rising from boiler
                const t = particle.offset / 0.3;
                x = 0;
                y = 4 + (t * 2); // 4 to 6
                z = 0;
            } else {
                // Moving to turbine
                const t = (particle.offset - 0.3) / 0.7;
                x = t * 8; // 0 to 8
                y = 6;
                z = 0;
            }

            dummy.position.set(x, y, z);
            dummy.scale.setScalar(0.2 * Math.sin(particle.offset * Math.PI)); // Fade in/out
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} {...props}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </instancedMesh>
    );
}
