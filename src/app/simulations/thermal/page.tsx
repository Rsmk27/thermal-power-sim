"use client";

import React, { useEffect } from 'react';
import SimulationLayout from '@/components/layout/SimulationLayout';
import ThermalScene from '@/features/thermal/ThermalScene';
import { useThermalStore } from '@/store/thermalStore';

export default function ThermalSimulationPage() {
    const { tick } = useThermalStore();

    // Simulation Loop
    useEffect(() => {
        let lastTime = performance.now();
        let frameId: number;

        const loop = (time: number) => {
            const delta = (time - lastTime) / 1000;
            lastTime = time;
            tick(delta);
            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [tick]);

    return (
        <div className="fixed inset-0 overflow-hidden">
            <SimulationLayout>
                <ThermalScene />
            </SimulationLayout>
        </div>
    );
}
