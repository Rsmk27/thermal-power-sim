import { create } from 'zustand';

interface ThermalPlantState {
    // Inputs
    targetLoad: number; // 0-100%
    fuelInput: number; // 0-100%

    // System State
    isRunning: boolean;
    isTripped: boolean;
    simulationTime: number;

    // Physics / Simulation Variables
    boilerPressure: number; // Bar
    boilerTemp: number; // Celsius
    steamFlowRate: number; // kg/s
    turbineRPM: number; // RPM
    generatorMW: number; // MW

    // Interaction State
    hoveredComponent: string | null;
    selectedComponent: string | null;

    // Alarms
    activeAlarms: string[];

    // Actions
    setTargetLoad: (load: number) => void;
    setFuelInput: (input: number) => void;
    setHoveredComponent: (component: string | null) => void;
    setSelectedComponent: (component: string | null) => void;
    dismissAlarm: (alarm: string) => void;
    startSimulation: () => void;
    stopSimulation: () => void;
    tripTurbine: () => void;
    reset: () => void;

    // Simulation Loop
    tick: (delta: number) => void;
}

export const useThermalStore = create<ThermalPlantState>((set, get) => ({
    targetLoad: 50,
    fuelInput: 50,

    isRunning: false,
    isTripped: false,
    simulationTime: 0,

    boilerPressure: 100,
    boilerTemp: 300,
    steamFlowRate: 50,
    turbineRPM: 0,
    generatorMW: 0,

    hoveredComponent: null,
    selectedComponent: null,
    activeAlarms: [],

    setTargetLoad: (load) => set({ targetLoad: load }),
    setFuelInput: (input) => set({ fuelInput: input }),
    setHoveredComponent: (component) => set({ hoveredComponent: component }),
    setSelectedComponent: (component) => set({ selectedComponent: component }),
    dismissAlarm: (alarm) => set((state) => ({ activeAlarms: state.activeAlarms.filter(a => a !== alarm) })),
    startSimulation: () => set({ isRunning: true, isTripped: false }),
    stopSimulation: () => set({ isRunning: false }),
    tripTurbine: () => set({ isTripped: true, isRunning: false, activeAlarms: [...get().activeAlarms, 'TURBINE TRIP'] }),
    reset: () => set({
        targetLoad: 50,
        fuelInput: 50,
        isRunning: false,
        isTripped: false,
        simulationTime: 0,
        boilerPressure: 100,
        boilerTemp: 300,
        steamFlowRate: 50,
        turbineRPM: 0,
        generatorMW: 0,
        hoveredComponent: null,
        selectedComponent: null,
        activeAlarms: []
    }),

    tick: (delta) => {
        const state = get();
        if (!state.isRunning && state.turbineRPM <= 0) return;

        // Simple Physics Simulation

        // 1. Fuel -> Heat
        const targetTemp = 100 + (state.fuelInput * 5); // 100C to 600C
        const tempDiff = targetTemp - state.boilerTemp;
        const newTemp = state.boilerTemp + (tempDiff * delta * 0.5); // Thermal inertia

        // 2. Heat -> Pressure
        const targetPressure = newTemp * 0.5;
        const pressureDiff = targetPressure - state.boilerPressure;
        const newPressure = state.boilerPressure + (pressureDiff * delta * 1.0);

        // 3. Pressure + Load -> Flow
        const valveOpening = state.targetLoad / 100;
        const targetFlow = newPressure * valveOpening;
        const flowDiff = targetFlow - state.steamFlowRate;
        const newFlow = state.steamFlowRate + (flowDiff * delta * 2.0);

        // 4. Flow -> RPM
        let targetRPM = newFlow * 30; // Max ~3000 RPM
        if (state.isTripped) targetRPM = 0;

        const rpmDiff = targetRPM - state.turbineRPM;
        const inertia = state.isTripped ? 0.5 : 0.2;
        const newRPM = state.turbineRPM + (rpmDiff * delta * inertia);

        // 5. RPM -> MW
        const newMW = (newRPM / 3000) * 500; // Max 500 MW

        // Check Alarms
        const newAlarms = [...state.activeAlarms];

        // Boiler Overheat
        if (newTemp > 550 && !newAlarms.includes('BOILER OVERHEAT')) {
            newAlarms.push('BOILER OVERHEAT');
        } else if (newTemp < 540 && newAlarms.includes('BOILER OVERHEAT')) {
            // Auto-clear if temp drops (optional, or require manual dismiss)
            // For now, let's keep it sticky until dismissed or fixed significantly
            const index = newAlarms.indexOf('BOILER OVERHEAT');
            if (index > -1) newAlarms.splice(index, 1);
        }

        // Overpressure
        if (newPressure > 280 && !newAlarms.includes('BOILER OVERPRESSURE')) {
            newAlarms.push('BOILER OVERPRESSURE');
        } else if (newPressure < 270 && newAlarms.includes('BOILER OVERPRESSURE')) {
            const index = newAlarms.indexOf('BOILER OVERPRESSURE');
            if (index > -1) newAlarms.splice(index, 1);
        }

        set({
            simulationTime: state.simulationTime + delta,
            boilerTemp: newTemp,
            boilerPressure: newPressure,
            steamFlowRate: newFlow,
            turbineRPM: Math.max(0, newRPM),
            generatorMW: Math.max(0, newMW),
            activeAlarms: newAlarms
        });
    },
}));
