import React from 'react';

interface SliderProps {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export function Slider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange, disabled = false }: SliderProps) {
    return (
        <div className={`flex flex-col gap-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">{label}</label>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded">
                    {value.toFixed(0)}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
            />
        </div>
    );
}
