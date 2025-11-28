import React from 'react';
import { useThermalStore, STEP_DESCRIPTIONS, SimulationStep } from '@/store/thermalStore';
import { ChevronRight, ChevronLeft, Info } from 'lucide-react';

export function StepControls() {
    const { currentStep, nextStep, prevStep, setStep } = useThermalStore();
    const stepInfo = STEP_DESCRIPTIONS[currentStep];

    const steps = Object.values(SimulationStep);
    const currentIndex = steps.indexOf(currentStep);
    const progress = ((currentIndex) / (steps.length - 1)) * 100;

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pointer-events-none z-10">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl pointer-events-auto transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
                                Step {currentIndex + 1} of {steps.length}
                            </span>
                            <div className="h-1 w-24 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cyan-400 transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{stepInfo.title}</h2>
                        <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                            {stepInfo.description}
                        </p>
                    </div>
                    <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <Info size={20} />
                    </button>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
                    <button
                        onClick={prevStep}
                        disabled={currentIndex === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                            ${currentIndex === 0
                                ? 'text-slate-600 cursor-not-allowed'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {steps.map((step, idx) => (
                            <button
                                key={step}
                                onClick={() => setStep(step)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 
                                    ${idx === currentIndex ? 'bg-cyan-400 w-6' : 'bg-slate-600 hover:bg-slate-500'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextStep}
                        disabled={currentIndex === steps.length - 1}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all
                            ${currentIndex === steps.length - 1
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                            }`}
                    >
                        Next
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
