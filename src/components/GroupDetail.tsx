import { motion } from 'motion/react';
import { Screen } from '../types';

interface GroupDetailProps {
  onNavigate: (screen: Screen) => void;
}

export default function GroupDetail({ onNavigate }: GroupDetailProps) {
  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto space-y-8">
      <nav className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
        <span className="cursor-pointer hover:text-primary" onClick={() => onNavigate('dashboard')}>Groups</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-primary">Berlin Route Pool</span>
      </nav>

      <header className="space-y-2">
        <h2 className="text-3xl font-headline font-extrabold">Berlin Route Pool</h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Optimized shared transport from Cologne Logistics Hub to Berlin Mitte. Status: <span className="text-secondary font-bold">In Transit</span>
        </p>
      </header>

      <button className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
        <span className="material-symbols-outlined">payments</span>
        Generate Deposit Link
      </button>

      {/* Route Map */}
      <div className="relative h-64 rounded-[2.5rem] overflow-hidden bg-slate-900">
        <img 
          src="https://picsum.photos/seed/germany/1200/600" 
          alt="Route Map" 
          className="w-full h-full object-cover opacity-40 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-xs font-bold text-white">Cologne → Berlin</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProgressStep icon="check_circle" label="Forming" status="completed" />
        <ProgressStep icon="handshake" label="Meeting" status="completed" />
        <ProgressStep icon="local_shipping" label="Shipped" status="current" />
        <ProgressStep icon="location_on" label="Arrived" status="pending" />
      </div>

      {/* Group Coordination */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-headline font-bold">Group Coordination</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-tertiary text-white text-[10px] font-bold">LIVE</span>
            <button 
              onClick={() => onNavigate('chat')}
              className="text-primary text-xs font-bold hover:underline"
            >
              Open Full Chat
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
              <img src="https://i.pravatar.cc/100?u=marcus" alt="Marcus" referrerPolicy="no-referrer" />
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none flex-1">
              <p className="text-[10px] font-bold text-primary uppercase mb-1">Marcus (Main Receiver)</p>
              <p className="text-sm text-on-surface leading-relaxed">
                Driver just confirmed the departure from Cologne. Estimated to be in Berlin by 19:00 tonight. 🚚
              </p>
            </div>
          </div>

          <div className="flex gap-3 flex-row-reverse">
            <div className="bg-primary p-4 rounded-2xl rounded-tr-none flex-1 text-white">
              <p className="text-sm leading-relaxed">
                Perfect! I'll be at the pickup point. All items were labeled clearly as discussed.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              YOU
            </div>
          </div>
        </div>
      </section>

      {/* Core Roles */}
      <section className="space-y-4">
        <h3 className="text-lg font-headline font-bold">Core Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RoleCard icon="mail" role="Main Sender" name="You (Alex Johnson)" />
          <RoleCard icon="inbox" role="Main Receiver" name="Marcus Weber" />
        </div>
      </section>

      {/* Resources */}
      <section className="bg-surface-container-low p-8 rounded-[2.5rem] space-y-4">
        <h3 className="text-lg font-headline font-bold">Resources</h3>
        <div className="space-y-2">
          <ResourceItem icon="description" label="Consolidated Bill" />
          <ResourceItem icon="qr_code_2" label="Batch Labels (8)" />
          <ResourceItem icon="verified_user" label="Insurance Details" />
        </div>
      </section>
    </div>
  );
}

function ProgressStep({ icon, label, status }: any) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  return (
    <div className={`p-6 rounded-3xl flex flex-col items-center gap-3 border transition-all ${
      isCompleted ? 'bg-white border-primary/10' : 
      isCurrent ? 'bg-white border-primary shadow-lg shadow-primary/5' : 
      'bg-surface-container-low border-transparent opacity-50'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
        isCompleted ? 'bg-primary/10 text-primary' : 
        isCurrent ? 'bg-primary text-white' : 
        'bg-surface-container text-on-surface-variant'
      }`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold">{label}</p>
        {isCurrent && <p className="text-[10px] text-on-surface-variant font-medium">Estimated arrival: 6h</p>}
      </div>
    </div>
  );
}

function RoleCard({ icon, role, name }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-4 border border-transparent hover:border-primary/10 transition-all">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{role}</p>
        <p className="text-sm font-bold text-on-surface">{name}</p>
      </div>
    </div>
  );
}

function ResourceItem({ icon, label }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-primary/5 transition-colors">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </div>
  );
}
