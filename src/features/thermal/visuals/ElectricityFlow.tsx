import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThermalStore } from '@/store/thermalStore';
import * as THREE from 'three';

export function ElectricityFlow(props: any) {
    const count = 50;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const generatorMW = useThermalStore((state) => state.generatorMW);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            offset: Math.random(),
            speed: 0.5 + Math.random() * 0.5
        }));
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const outputLevel = generatorMW / 500; // 0-1
        if (outputLevel < 0.01) {
            meshRef.current.visible = false;
            return;
        }
        meshRef.current.visible = true;

        particles.forEach((particle, i) => {
            particle.offset += particle.speed * delta;
            if (particle.offset > 1) particle.offset = 0;

            // Path: Generator Terminals -> Out
            // Start: [14, 3, 3.5]
            // End: [14, 3, 10]

            const x = 14;
            const y = 3;
            const z = 3.5 + (particle.offset * 10);

            dummy.position.set(x, y, z);
            dummy.scale.setScalar(0.1 + (Math.random() * 0.1));
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        (meshRef.current.material as THREE.MeshBasicMaterial).opacity = outputLevel;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} {...props}>
            <boxGeometry args={[0.1, 0.1, 0.5]} />
            {/* High intensity color for bloom */}
            <meshBasicMaterial color={[0, 10, 10]} toneMapped={false} transparent blending={THREE.AdditiveBlending} />
        </instancedMesh>
    );
}
