import { motion } from 'motion/react';
import { Screen } from '../types';

interface LandingProps {
  onNavigate: (screen: Screen) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-primary p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-bold tracking-wider mb-6 uppercase">
              AI Logistics Hub
            </span>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-4 leading-tight">
              Effortless shipping, <br /> optimized by AI.
            </h2>
            <p className="text-primary-fixed/80 text-lg mb-8 max-w-md">
              Your carbon footprint has decreased by 24% this month through intelligent route splitting.
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="bg-white text-primary px-6 py-3.5 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
              >
                Explore Shipments
              </button>
              <div className="flex flex-col">
                <span className="text-3xl font-headline font-extrabold">1.2 Tons</span>
                <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">CO2 Offset Saved</span>
              </div>
            </div>
          </motion.div>
          
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <span className="material-symbols-outlined text-4xl mb-3">auto_awesome</span>
                <p className="text-sm font-semibold opacity-80">AI Insights</p>
                <p className="text-xl font-bold">12 Potential Matches</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <span className="material-symbols-outlined text-4xl mb-3">local_shipping</span>
                <p className="text-sm font-semibold opacity-80">Active Fleet</p>
                <p className="text-xl font-bold">4 In-Transit</p>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-tertiary/20 rounded-full blur-3xl"></div>
      </section>

      {/* Active Shipments Preview */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-headline font-bold">Active Shipments</h3>
            <p className="text-on-surface-variant text-sm">Real-time logistics monitoring</p>
          </div>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ShipmentPreviewCard 
            id="7721"
            route="Chicago → New York"
            status="In Transit"
            progress={65}
            eta="4h 20m"
            image="https://picsum.photos/seed/chicago/800/400"
            onNavigate={() => onNavigate('tracker')}
          />
          <ShipmentPreviewCard 
            id="8012"
            route="Seattle → Los Angeles"
            status="AI-Optimizing"
            progress={15}
            eta="Analyzing Weather"
            image="https://picsum.photos/seed/seattle/800/400"
            onNavigate={() => onNavigate('tracker')}
            isOptimizing
          />
        </div>
      </section>

      {/* AI Match Suggestions */}
      <section className="bg-surface-container-low rounded-[2.5rem] p-8">
        <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">auto_awesome</span>
          AI Match Suggestions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MatchSuggestionCard 
            title="Route Alpha-9"
            subtitle="Consolidated Load"
            score={98}
            description="Matches your recurring Friday window for high-value tech cargo."
            icon="conversion_path"
          />
          <MatchSuggestionCard 
            title="Route Delta-4"
            subtitle="Shared Space"
            score={85}
            description="Optimal filling strategy found for partial container heading to Texas."
            icon="share_location"
          />
          <div className="bg-primary p-6 rounded-2xl shadow-lg shadow-primary/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-white">verified</span>
                <p className="text-sm font-bold text-white">Power Optimization</p>
              </div>
              <p className="text-xs text-white/80">Our AI suggests batching the next 3 orders to save $1,200 in logistics overhead.</p>
            </div>
            <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors">
              Apply Strategy
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ShipmentPreviewCard({ id, route, status, progress, eta, image, onNavigate, isOptimizing }: any) {
  return (
    <div 
      onClick={onNavigate}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer"
    >
      <div className="h-40 relative">
        <img src={image} alt={route} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        <div className={`absolute top-4 right-4 ${isOptimizing ? 'bg-tertiary' : 'bg-secondary'} text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg`}>
          {status}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-headline font-bold text-lg">Batch #{id}</h4>
            <p className="text-sm text-on-surface-variant">{route}</p>
          </div>
          <div className={`${isOptimizing ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'} px-2 py-1 rounded-lg`}>
            <span className="material-symbols-outlined text-xl">{isOptimizing ? 'auto_awesome' : 'analytics'}</span>
          </div>
        </div>
        <div className="w-full bg-surface-container rounded-full h-1.5 mb-2">
          <div className={`${isOptimizing ? 'bg-tertiary' : 'bg-primary'} h-1.5 rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between text-[11px] font-bold text-on-surface-variant uppercase">
          <span>{progress}% Journey</span>
          <span>ETA: {eta}</span>
        </div>
      </div>
    </div>
  );
}

function MatchSuggestionCard({ title, subtitle, score, description, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-transparent hover:border-primary/10 transition-all cursor-pointer group">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <p className="text-sm font-bold">{title}</p>
            <p className="text-[10px] text-on-surface-variant uppercase font-semibold">{subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-headline font-extrabold text-primary">{score}%</span>
        </div>
      </div>
      <p className="text-xs text-on-surface-variant mb-4">{description}</p>
      <button className="w-full py-2 bg-surface-container-low text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">
        Accept Match
      </button>
    </div>
  );
}
