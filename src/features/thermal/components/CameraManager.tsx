import { useFrame, useThree } from '@react-three/fiber';
import { useThermalStore, SimulationStep } from '@/store/thermalStore';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';

// Target positions for camera and controls
const STEP_VIEWS: Record<SimulationStep, { position: [number, number, number], target: [number, number, number] }> = {
    [SimulationStep.IDLE]: {
        position: [5, 12, 25],
        target: [-5, 4, 0]
    },
    [SimulationStep.COAL_HANDLING]: {
        position: [-15, 8, 15],
        target: [-18, 2, 0]
    },
    [SimulationStep.COMBUSTION]: {
        position: [-5, 10, 15],
        target: [-10, 4, 0]
    },
    [SimulationStep.STEAM_GENERATION]: {
        position: [0, 8, 12],
        target: [-5, 4, 0]
    },
    [SimulationStep.TURBINE_ROTATION]: {
        position: [5, 8, 12],
        target: [0, 2, 0]
    },
    [SimulationStep.POWER_GENERATION]: {
        position: [12, 8, 12],
        target: [6, 2, 0]
    },
    [SimulationStep.TRANSMISSION]: {
        position: [20, 15, 20],
        target: [10, 0, -5]
    }
};

export function CameraManager({ controlsRef }: { controlsRef: React.RefObject<any> }) {
    const currentStep = useThermalStore((state) => state.currentStep);
    const { camera } = useThree();

    // Smooth animation state
    const targetPos = useRef(new THREE.Vector3(...STEP_VIEWS[SimulationStep.IDLE].position));
    const targetLookAt = useRef(new THREE.Vector3(...STEP_VIEWS[SimulationStep.IDLE].target));

    useEffect(() => {
        const view = STEP_VIEWS[currentStep];
        if (view) {
            targetPos.current.set(...view.position);
            targetLookAt.current.set(...view.target);
        }
    }, [currentStep]);

    useFrame((state, delta) => {
        if (!controlsRef.current) return;

        // Smoothly interpolate camera position
        camera.position.lerp(targetPos.current, 2.0 * delta);

        // Smoothly interpolate controls target
        controlsRef.current.target.lerp(targetLookAt.current, 2.0 * delta);
        controlsRef.current.update();
    });

    return null;
}
