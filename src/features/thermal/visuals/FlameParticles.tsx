import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThermalStore } from '@/store/thermalStore';
import * as THREE from 'three';

export function FlameParticles(props: any) {
    const count = 100;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const fuelInput = useThermalStore((state) => state.fuelInput);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
            ),
            velocity: new THREE.Vector3(0, Math.random() * 0.1, 0),
            life: Math.random(),
            scale: Math.random()
        }));
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const intensity = fuelInput / 100;

        particles.forEach((particle, i) => {
            // Rise up
            particle.position.y += particle.velocity.y * 60 * delta;
            particle.life -= delta * 0.5;

            // Reset
            if (particle.life <= 0) {
                particle.life = 1;
                particle.position.set(
                    (Math.random() - 0.5) * 4,
                    -3, // Start at bottom
                    (Math.random() - 0.5) * 4
                );
            }

            // Scale based on life and intensity
            const scale = particle.scale * Math.sin(particle.life * Math.PI) * intensity;

            dummy.position.copy(particle.position);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        (meshRef.current.material as THREE.MeshBasicMaterial).opacity = intensity;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} {...props}>
            <planeGeometry args={[1, 1]} />
            {/* High intensity orange/red for fire bloom */}
            <meshBasicMaterial color={[4, 1, 0]} toneMapped={false} transparent blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </instancedMesh>
    );
}
