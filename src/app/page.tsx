import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950 text-white">
      <h1 className="text-4xl font-bold mb-8">Power Plant Simulations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/simulations/thermal" className="group block p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500 transition-colors">
          <h2 className="text-2xl font-semibold mb-2 group-hover:text-cyan-400">Thermal Power Plant &rarr;</h2>
          <p className="text-slate-400">Interactive 3D simulation of a steam cycle power plant.</p>
        </Link>
        {/* Future simulations */}
        <div className="p-6 bg-slate-900/50 border border-slate-800/50 rounded-xl opacity-50 cursor-not-allowed">
          <h2 className="text-2xl font-semibold mb-2">Nuclear Reactor (Coming Soon)</h2>
          <p className="text-slate-500">PWR core simulation.</p>
        </div>
      </div>
    </main>
  );
}
