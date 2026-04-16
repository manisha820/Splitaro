import { motion } from 'motion/react';
import { Screen } from '../types';
import { useData } from '../contexts/DataContext';

interface TrackerProps {
  onNavigate: (screen: Screen) => void;
}

export default function Tracker({ onNavigate }: TrackerProps) {
  const { shipments, selectedShipmentId } = useData();
  const shipment = shipments.find(s => s.id === selectedShipmentId);

  if (!shipment) {
    return (
      <div className="pt-24 px-6 max-w-7xl mx-auto space-y-6 text-center">
        <p>Shipment not found.</p>
        <button onClick={() => onNavigate('dashboard')} className="text-primary font-bold">Go Back</button>
      </div>
    );
  }

  const p = shipment.progress;

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <button onClick={() => onNavigate('dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-xl font-headline font-bold">Shipment Tracker</h2>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      {/* Map View */}
      <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-inner bg-slate-200">
        <img 
          src="https://picsum.photos/seed/map/1200/600" 
          alt="Map" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
          <span className="text-xs font-bold text-primary">{shipment.origin} → {shipment.destination}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40 animate-bounce">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <div className="bg-white px-4 py-1 rounded-full shadow-lg text-[10px] font-bold uppercase tracking-widest text-primary">
              {shipment.status}
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Info */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Tracking ID</p>
            <h3 className="text-2xl font-headline font-extrabold text-primary">#{shipment.id.slice(0,8).toUpperCase()}</h3>
          </div>
          <div className="bg-primary/10 px-4 py-2 rounded-2xl text-center">
            <p className="text-[10px] font-bold uppercase text-primary/60">Status</p>
            <p className="text-sm font-headline font-bold text-primary">{shipment.progress}%</p>
          </div>
        </div>

        <div className="flex p-1 bg-surface-container rounded-2xl">
          <button className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">
            Sender View
          </button>
          <button className="flex-1 py-3 rounded-xl text-on-surface-variant text-sm font-bold">
            Receiver View
          </button>
        </div>
      </div>

      {/* Journey Progress */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-8">
        <h3 className="text-lg font-headline font-bold">Journey Progress</h3>
        
        <div className="space-y-0">
          <TimelineItem 
            title="Shipment Processing"
            description={shipment.description}
            status={p >= 10 ? 'completed' : p > 0 ? 'current' : 'pending'}
            icon="schedule"
            tags={['Details confirmed']}
          />
          <TimelineItem 
            title="AI Optimization"
            description={shipment.type === 'batch' ? "Matched in Route Pool" : "Scanning routes..."}
            status={p >= 40 ? 'completed' : p >= 10 ? 'current' : 'pending'}
            icon="auto_awesome"
            tags={shipment.type === 'batch' ? ['Route Pool', 'Shared'] : ['Solo']}
          />
          <TimelineItem 
            title="In Transit"
            description={`Headed to ${shipment.destination}`}
            status={p >= 100 ? 'completed' : p >= 40 ? 'current' : 'pending'}
            icon="local_shipping"
          />
          <TimelineItem 
            title="Delivered"
            description="Package arrived"
            status={p === 100 ? 'completed' : 'pending'}
            icon="home"
            isLast
          />
        </div>
      </div>

      {/* AI Prediction */}
      <div className="bg-gradient-to-br from-primary/5 to-tertiary/5 p-6 rounded-[2.5rem] border border-primary/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">AI Prediction</p>
          <p className="text-sm font-bold text-on-surface">Arriving optimally for this route.</p>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ title, date, time, status, icon, description, tags, isLast }: any) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${
          isCompleted ? 'bg-primary text-white' : 
          isCurrent ? 'bg-primary text-white ring-4 ring-primary/20' : 
          'bg-surface-container text-on-surface-variant'
        }`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        {!isLast && (
          <div className={`w-0.5 h-16 transition-colors duration-500 ${isCompleted ? 'bg-primary' : 'bg-surface-container'}`}></div>
        )}
      </div>
      <div className="pb-8 flex-1">
        <h4 className={`font-bold transition-colors ${isCompleted || isCurrent ? 'text-on-surface' : 'text-on-surface-variant'}`}>
          {title}
        </h4>
        {date && <p className="text-xs text-on-surface-variant">{date} • {time}</p>}
        {description && <p className={`text-xs font-semibold mt-1 ${isCompleted || isCurrent ? 'text-primary' : 'text-on-surface-variant/50'}`}>{description}</p>}
        {tags && (
          <div className="flex gap-2 mt-2">
            {tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 rounded-lg bg-surface-container text-[10px] font-bold text-on-surface-variant uppercase">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
