import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen } from '../types';
import { useData } from '../contexts/DataContext';
import AddShipment from './AddShipment';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { shipments, matches, joinMatch, advanceShipment, setSelectedShipmentId, setSelectedGroupId } = useData();
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-headline font-extrabold">Active Shipments</h2>
        <p className="text-on-surface-variant">Managing {shipments.length} packages in transit</p>
      </header>

      {/* New Shipment CTA */}
      <div 
        onClick={() => setIsAdding(true)}
        className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-white shadow-xl shadow-primary/20 flex justify-between items-center group cursor-pointer"
      >
        <div>
          <h3 className="text-xl font-headline font-bold mb-1">New Shipment</h3>
          <p className="text-white/60 text-xs font-bold tracking-widest uppercase">Share space, save cost</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-3xl">add</span>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && <AddShipment onClose={() => setIsAdding(false)} />}
      </AnimatePresence>

      {/* My Shipments */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-headline font-bold">My Shipments</h3>
          <button className="text-primary text-sm font-bold">View All</button>
        </div>

        <div className="space-y-4">
          {shipments.map(shipment => {
            const calculatedEta = shipment.progress === 100 
              ? 'Arrived' 
              : `${Math.floor((100 - shipment.progress) * 0.4)}h ${Math.floor(Math.random() * 60)}m remaining`;
              
            return (
              <ShipmentCard 
                key={shipment.id}
                id={shipment.id.slice(0,8).toUpperCase()}
                route={`${shipment.origin} → ${shipment.destination}`}
                status={shipment.status}
                weight={shipment.weight}
                eta={shipment.eta || calculatedEta}
                progress={shipment.progress}
                onNavigate={() => { setSelectedShipmentId(shipment.id); onNavigate('tracker'); }}
                onAdvance={(e: any) => { e.stopPropagation(); advanceShipment(shipment.id); }}
              />
            );
          })}
        </div>
      </section>

      {/* Suggested Matches */}
      <section className="space-y-4">
        <h3 className="text-lg font-headline font-bold">Suggested Matches</h3>
        <div className="space-y-4">
          {matches.map(match => (
            <div 
              key={match.id}
              onClick={() => { if(match.groupId) setSelectedGroupId(match.groupId); onNavigate('group-detail'); }}
              className="relative overflow-hidden rounded-3xl bg-primary/5 p-6 border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  {(match.avatars || [1, 2, 3]).map((avatar, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-container overflow-hidden">
                      <img src={typeof avatar === 'string' ? avatar : `https://i.pravatar.cc/100?u=${i}`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                    +12
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-headline font-bold mb-1">{match.title}</h4>
              <p className="text-primary text-sm mb-4">{match.subtitle}</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if(match.groupId && match.shipmentId) joinMatch(match.groupId, match.shipmentId);
                }}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
              >
                Join Group
              </button>
              
              {/* Background decoration */}
              <div className="absolute right-0 bottom-0 opacity-10">
                <span className="material-symbols-outlined text-9xl">hub</span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low p-6 rounded-3xl">
          <span className="material-symbols-outlined text-tertiary mb-3">savings</span>
          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Potential Saving</p>
          <p className="text-2xl font-headline font-extrabold">${(shipments.length * 12.50 + matches.length * 35).toFixed(2)}</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-3xl">
          <span className="material-symbols-outlined text-secondary mb-3">bolt</span>
          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Match Score</p>
          <p className="text-2xl font-headline font-extrabold">{matches.length > 0 ? matches[0].score + '%' : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

function ShipmentCard({ id, route, status, weight, eta, progress, onNavigate, onAdvance }: any) {
  const isOptimizing = status === 'AI-Optimizing';
  const isDelivered = status === 'Delivered';
  
  const statusColor = isOptimizing 
    ? 'bg-tertiary/10 text-tertiary' 
    : isDelivered 
      ? 'bg-green-500/10 text-green-600'
      : 'bg-secondary/10 text-secondary';
      
  const barColor = isOptimizing 
    ? 'bg-tertiary' 
    : isDelivered 
      ? 'bg-green-500' 
      : 'bg-secondary';

  return (
    <div 
      onClick={onNavigate}
      className="bg-white p-6 rounded-3xl shadow-sm border border-transparent hover:border-primary/10 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2 ${statusColor}`}>
            {status}
          </span>
          <h4 className="text-xl font-headline font-bold">{route}</h4>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase">Order #{id}</p>
          <p className="text-lg font-headline font-extrabold text-primary">{weight}</p>
        </div>
      </div>
      <div className="h-1 w-full bg-surface-container rounded-full mb-4 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">
            {isDelivered ? 'check_circle' : isOptimizing ? 'schedule' : 'local_shipping'}
          </span>
          {eta}
        </div>
        <div className="flex items-center gap-4">
          {!isDelivered && (
            <button 
              onClick={onAdvance}
              className="flex items-center gap-1 text-tertiary hover:bg-tertiary/10 px-2 py-1 rounded-lg transition-colors"
              title="Advance Demo Progress"
            >
              Advance <span className="material-symbols-outlined text-sm">fast_forward</span>
            </button>
          )}
          <div className="flex items-center gap-1 text-primary">
            Details <span className="material-symbols-outlined text-sm">chevron_right</span>
          </div>
        </div>
      </div>
    </div>
  );
}

