"use client";

import React, { useEffect } from 'react';
import SimulationLayout from '@/components/layout/SimulationLayout';
import ThermalScene from '@/features/thermal/ThermalScene';
import { useThermalStore } from '@/store/thermalStore';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Play, Pause, AlertTriangle, RotateCcw } from 'lucide-react';

export default function ThermalSimulationPage() {
    const {
        targetLoad, setTargetLoad,
        fuelInput, setFuelInput,
        isRunning, isTripped,
        startSimulation, stopSimulation, tripTurbine, reset,
        boilerTemp, boilerPressure, turbineRPM, generatorMW,
        tick
    } = useThermalStore();

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

    // Controls Panel Content
    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="space-y-4">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Operation</h3>
                <div className="flex gap-2">
                    {!isRunning ? (
                        <Button onClick={startSimulation} className="flex-1 flex items-center justify-center gap-2">
                            <Play size={16} /> Start
                        </Button>
                    ) : (
                        <Button onClick={stopSimulation} variant="secondary" className="flex-1 flex items-center justify-center gap-2">
                            <Pause size={16} /> Pause
                        </Button>
                    )}
                    <Button onClick={reset} variant="secondary" title="Reset">
                        <RotateCcw size={16} />
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Safety Systems</h3>
                <Button
                    onClick={tripTurbine}
                    variant="danger"
                    disabled={isTripped}
                    className="w-full flex items-center justify-center gap-2 py-4"
                >
                    <AlertTriangle size={20} />
                    {isTripped ? 'TURBINE TRIPPED' : 'EMERGENCY TRIP'}
                </Button>
            </div>

            <div className="space-y-6">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Parameters</h3>
                <Slider
                    label="Target Load"
                    value={targetLoad}
                    onChange={setTargetLoad}
                    unit="%"
                />
                <Slider
                    label="Fuel Input"
                    value={fuelInput}
                    onChange={setFuelInput}
                    unit="%"
                />
            </div>
        </div>
    );

    // Info Panel Content
    const Info = (
        <div className="grid grid-cols-4 gap-4 h-full">
            <MetricCard label="Generator Output" value={generatorMW.toFixed(1)} unit="MW" color="text-cyan-400" />
            <MetricCard label="Turbine Speed" value={turbineRPM.toFixed(0)} unit="RPM" color="text-emerald-400" />
            <MetricCard label="Steam Pressure" value={boilerPressure.toFixed(1)} unit="Bar" color="text-orange-400" />
            <MetricCard label="Boiler Temp" value={boilerTemp.toFixed(0)} unit="°C" color="text-red-400" />
        </div>
    );

    return (
        <div className="fixed inset-0 overflow-hidden">
            <SimulationLayout controls={Controls} info={Info}>
                <ThermalScene />
            </SimulationLayout>
        </div>
    );
}

function MetricCard({ label, value, unit, color }: { label: string, value: string, unit: string, color: string }) {
    return (
        <div className="bg-slate-800/40 rounded-xl p-4 flex flex-col justify-between items-start border border-slate-700/50 hover:border-slate-600 transition-colors group">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-slate-300 transition-colors">{label}</div>
            <div className={`text-4xl font-mono font-bold ${color} drop-shadow-lg`}>
                {value}<span className="text-lg ml-1 text-slate-500 font-sans font-medium">{unit}</span>
            </div>
        </div>
    );
}
