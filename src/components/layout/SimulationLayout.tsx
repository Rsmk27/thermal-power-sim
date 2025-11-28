import React, { ReactNode } from 'react';
import { useThermalStore } from '@/store/thermalStore';

interface SimulationLayoutProps {
    children: ReactNode; // The 3D Scene
}

export default function SimulationLayout({ children }: SimulationLayoutProps) {
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
                </div>
            </div>

            {/* Interaction Overlays (Tooltips, Modals) - z-50 */}
            <TooltipOverlay />
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
