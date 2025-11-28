import React, { ReactNode } from 'react';
import { useThermalStore } from '@/store/thermalStore';

interface SimulationLayoutProps {
    children: ReactNode; // The 3D Scene
    controls: ReactNode; // The Control Panel content
    info: ReactNode; // The Info Panel content
}

export default function SimulationLayout({ children, controls, info }: SimulationLayoutProps) {
    return (
        <div className="relative h-full w-full bg-slate-950 overflow-hidden text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* 3D Scene Layer - Full Screen */}
            <div className="absolute inset-0 z-0">
                {children}
            </div>

            {/* UI Overlay Layer */}
            <div className="absolute inset-0 z-10 flex flex-col pointer-events-none p-4">

                {/* Top Section: Title & Status */}
                <div className="flex justify-between items-start pointer-events-auto">
                    <div className="bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-800/50 shadow-lg">
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Thermal Power Plant
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Simulation Active</span>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Main Viewport Area */}
                <div className="flex-1 flex min-h-0 relative">
                    {/* Center space is empty for 3D interaction */}

                    {/* Right: Floating Control Panel */}
                    <aside className="absolute right-0 top-4 bottom-4 w-80 bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 overflow-y-auto pointer-events-auto">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] sticky top-0 bg-slate-900/0 backdrop-blur-none z-10 pb-2 border-b border-slate-800/50 mb-2">
                            Control Deck
                        </div>
                        {controls}
                    </aside>
                </div>

                {/* Bottom Section: Floating Info Panel */}
                <div className="mt-4 pointer-events-auto">
                    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
                        {info}
                    </div>
                </div>
            </div>

            {/* Interaction Overlays (Tooltips, Modals) - z-50 */}
            <TooltipOverlay />
            <DetailPanel />
            <AlarmOverlay />
        </div>
    );
}

function TooltipOverlay() {
    const hoveredComponent = useThermalStore((state) => state.hoveredComponent);

    if (!hoveredComponent) return null;

    return (
        <div className="absolute top-6 right-6 pointer-events-none z-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                <h3 className="text-xl font-bold text-cyan-400 mb-1">{hoveredComponent}</h3>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Click for Details</p>
            </div>
        </div>
    );
}

function DetailPanel() {
    const selectedComponent = useThermalStore((state) => state.selectedComponent);
    const setSelectedComponent = useThermalStore((state) => state.setSelectedComponent);

    // Get simulation values for display
    const { boilerTemp, boilerPressure, turbineRPM, generatorMW } = useThermalStore();

    if (!selectedComponent) return null;

    let details = null;
    if (selectedComponent === 'Boiler Furnace') {
        details = (
            <>
                <div className="text-sm text-slate-300 mb-2">Converts chemical energy from fuel into heat energy.</div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <div className="text-xs text-slate-500 uppercase">Temperature</div>
                        <div className="text-xl font-mono text-red-400">{boilerTemp.toFixed(0)}°C</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase">Pressure</div>
                        <div className="text-xl font-mono text-orange-400">{boilerPressure.toFixed(1)} Bar</div>
                    </div>
                </div>
            </>
        );
    } else if (selectedComponent === 'Steam Turbine') {
        details = (
            <>
                <div className="text-sm text-slate-300 mb-2">Converts thermal energy of steam into mechanical rotation.</div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <div className="text-xs text-slate-500 uppercase">Speed</div>
                        <div className="text-xl font-mono text-emerald-400">{turbineRPM.toFixed(0)} RPM</div>
                    </div>
                </div>
            </>
        );
    } else if (selectedComponent === 'Electric Generator') {
        details = (
            <>
                <div className="text-sm text-slate-300 mb-2">Converts mechanical rotation into electrical energy.</div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <div className="text-xs text-slate-500 uppercase">Output</div>
                        <div className="text-xl font-mono text-cyan-400">{generatorMW.toFixed(1)} MW</div>
                    </div>
                </div>
            </>
        );
    } else if (selectedComponent === 'Cooling Tower') {
        details = (
            <>
                <div className="text-sm text-slate-300 mb-2">Rejects waste heat to the atmosphere through evaporation.</div>
                <div className="mt-4">
                    <div className="text-xs text-slate-500 uppercase">Status</div>
                    <div className="text-lg font-mono text-slate-200">Operational</div>
                </div>
            </>
        );
    } else {
        details = <div className="text-sm text-slate-400">Select a component to view details.</div>;
    }

    return (
        <div className="absolute top-24 right-6 w-80 z-20 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl shadow-2xl relative">
                <button
                    onClick={() => setSelectedComponent(null)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedComponent}</h2>
                <div className="w-12 h-1 bg-cyan-500 mb-4 rounded-full" />
                {details}
            </div>
        </div>
    );
}

function AlarmOverlay() {
    const activeAlarms = useThermalStore((state) => state.activeAlarms);

    if (activeAlarms.length === 0) return null;

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md pointer-events-none">
            {activeAlarms.map((alarm) => (
                <div key={alarm} className="bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <span className="font-bold tracking-wider">{alarm}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
