import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThermalStore } from '@/store/thermalStore';
import * as THREE from 'three';

export function CoalParticles(props: any) {
    const count = 50;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const fuelInput = useThermalStore((state) => state.fuelInput);

    // Initial positions
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            x: (Math.random() - 0.5) * 10, // Spread along belt length
            y: 0,
            z: (Math.random() - 0.5) * 1.5, // Spread along belt width
            speed: 0.05 + Math.random() * 0.02
        }));
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Speed depends on fuel input
        const speedMultiplier = fuelInput / 100;

        particles.forEach((particle, i) => {
            // Move particle along X axis (conveyor direction)
            particle.x += particle.speed * speedMultiplier * 60 * delta;

            // Reset if it reaches the end (the boiler)
            if (particle.x > 6) {
                particle.x = -6;
            }

            dummy.position.set(particle.x, 1.5, particle.z);
            dummy.scale.setScalar(0.3);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} {...props}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </instancedMesh>
    );
}
