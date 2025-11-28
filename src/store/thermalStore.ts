import { create } from 'zustand';

export enum SimulationStep {
    IDLE = 'IDLE',
    COAL_HANDLING = 'COAL_HANDLING',
    COMBUSTION = 'COMBUSTION',
    STEAM_GENERATION = 'STEAM_GENERATION',
    TURBINE_ROTATION = 'TURBINE_ROTATION',
    POWER_GENERATION = 'POWER_GENERATION',
    TRANSMISSION = 'TRANSMISSION'
}

export const STEP_DESCRIPTIONS: Record<SimulationStep, { title: string; description: string }> = {
    [SimulationStep.IDLE]: {
        title: 'Thermal Power Plant',
        description: 'Welcome to the interactive Thermal Power Plant simulation. Click "Next" to start the tour.'
    },
    [SimulationStep.COAL_HANDLING]: {
        title: 'Coal Handling',
        description: 'Coal is transported via conveyor belts to the pulverizers, where it is crushed into a fine powder to ensure efficient combustion.'
    },
    [SimulationStep.COMBUSTION]: {
        title: 'Combustion (Boiler)',
        description: 'The pulverized coal is blown into the boiler furnace and ignited. This releases massive amounts of heat energy.'
    },
    [SimulationStep.STEAM_GENERATION]: {
        title: 'Steam Generation',
        description: 'Heat from combustion boils water flowing through tubes in the boiler walls, turning it into high-pressure, high-temperature steam.'
    },
    [SimulationStep.TURBINE_ROTATION]: {
        title: 'Steam Turbine',
        description: 'The high-pressure steam strikes the turbine blades, causing the shaft to rotate at high speeds (typically 3000 RPM).'
    },
    [SimulationStep.POWER_GENERATION]: {
        title: 'Generator',
        description: 'The rotating turbine shaft turns the generator rotor inside a magnetic field, inducing an electric current (electricity).'
    },
    [SimulationStep.TRANSMISSION]: {
        title: 'Transmission',
        description: 'The generated electricity is stepped up by transformers to high voltage for efficient long-distance transmission via the grid.'
    }
};

interface ThermalPlantState {
    // Inputs
    targetLoad: number; // 0-100%
    fuelInput: number; // 0-100%

    // System State
    isRunning: boolean;
    isTripped: boolean;
    simulationTime: number;
    currentStep: SimulationStep;

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
    setStep: (step: SimulationStep) => void;
    nextStep: () => void;
    prevStep: () => void;

    // Simulation Loop
    tick: (delta: number) => void;
}

export const useThermalStore = create<ThermalPlantState>((set, get) => ({
    targetLoad: 50,
    fuelInput: 50,

    isRunning: false,
    isTripped: false,
    simulationTime: 0,
    currentStep: SimulationStep.IDLE,

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
        currentStep: SimulationStep.IDLE,
        boilerPressure: 100,
        boilerTemp: 300,
        steamFlowRate: 50,
        turbineRPM: 0,
        generatorMW: 0,
        hoveredComponent: null,
        selectedComponent: null,
        activeAlarms: []
    }),
    setStep: (step) => set({ currentStep: step }),
    nextStep: () => {
        const steps = Object.values(SimulationStep);
        const currentIndex = steps.indexOf(get().currentStep);
        const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
        set({ currentStep: steps[nextIndex] });
    },
    prevStep: () => {
        const steps = Object.values(SimulationStep);
        const currentIndex = steps.indexOf(get().currentStep);
        const prevIndex = Math.max(currentIndex - 1, 0);
        set({ currentStep: steps[prevIndex] });
    },

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
