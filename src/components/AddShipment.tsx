import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext';

interface AddShipmentProps {
  onClose: () => void;
}

export default function AddShipment({ onClose }: AddShipmentProps) {
  const { addShipment } = useData();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addShipment({
      ...formData,
      weight: `${formData.weight} kg`,
      type: 'solo'
    });
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-on-surface/20 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 space-y-8 shadow-2xl"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-headline font-extrabold">Add New Shipment</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Origin City</label>
              <input 
                type="text" 
                required
                value={formData.origin}
                onChange={(e) => setFormData({...formData, origin: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="London"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Destination</label>
              <input 
                type="text" 
                required
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Berlin"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Weight (kg)</label>
            <input 
              type="number" 
              required
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="5.0"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Item Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all h-32 resize-none"
              placeholder="What are you shipping?"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-gradient-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Create Shipment
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
