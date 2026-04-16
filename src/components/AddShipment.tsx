import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [errors, setErrors] = useState<{ origin?: string; destination?: string; weight?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.origin.trim()) newErrors.origin = 'Origin is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    
    const weightNum = parseFloat(formData.weight);
    if (!formData.weight.trim()) newErrors.weight = 'Required';
    else if (isNaN(weightNum) || weightNum <= 0) newErrors.weight = 'Invalid number';
    else if (weightNum > 1000) newErrors.weight = 'Exceeds 1000kg limit';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length < 5) newErrors.description = 'Provide more detail';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    await addShipment({
      ...formData,
      weight: `${formData.weight} kg`,
      type: 'solo'
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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
          <h2 className="text-2xl font-headline font-extrabold flex items-center gap-2">
            Add New Shipment
            {isSuccess && <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>}
          </h2>
          <button onClick={onClose} disabled={isSubmitting} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container disabled:opacity-50">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Origin City</label>
              <input 
                type="text" 
                value={formData.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
                disabled={isSubmitting || isSuccess}
                className={`w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60 ${errors.origin ? 'ring-2 ring-red-500/50 bg-red-500/5' : ''}`}
                placeholder="London"
              />
              {errors.origin && <p className="text-[10px] text-red-500 font-bold px-1">{errors.origin}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Destination</label>
              <input 
                type="text" 
                value={formData.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
                disabled={isSubmitting || isSuccess}
                className={`w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60 ${errors.destination ? 'ring-2 ring-red-500/50 bg-red-500/5' : ''}`}
                placeholder="Berlin"
              />
              {errors.destination && <p className="text-[10px] text-red-500 font-bold px-1">{errors.destination}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Weight (kg)</label>
            <input 
              type="number" 
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              disabled={isSubmitting || isSuccess}
              className={`w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60 ${errors.weight ? 'ring-2 ring-red-500/50 bg-red-500/5' : ''}`}
              placeholder="5.0"
              step="0.1"
            />
            {errors.weight && <p className="text-[10px] text-red-500 font-bold px-1">{errors.weight}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Item Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isSubmitting || isSuccess}
              className={`w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all h-32 resize-none disabled:opacity-60 ${errors.description ? 'ring-2 ring-red-500/50 bg-red-500/5' : ''}`}
              placeholder="What are you shipping?"
            />
            {errors.description && <p className="text-[10px] text-red-500 font-bold px-1">{errors.description}</p>}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${isSuccess ? 'bg-green-500 shadow-green-500/30' : 'bg-gradient-primary shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100'}`}
          >
            {isSubmitting ? (
              <><span className="material-symbols-outlined animate-spin">progress_activity</span> Creating...</>
            ) : isSuccess ? (
              <><span className="material-symbols-outlined">check</span> Created Successfully</>
            ) : (
              'Create Shipment'
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
