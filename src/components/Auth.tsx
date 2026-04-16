import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

export default function Auth() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; auth?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email address';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!isLogin && !name.trim()) newErrors.name = 'Full Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors(prev => ({ ...prev, auth: undefined }));

    const { error } = await login(email, password, name || email.split('@')[0], isLogin);
    
    if (error) {
      setErrors(prev => ({ ...prev, auth: error }));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl shadow-primary/5 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join Splitaro'}
          </h2>
          <p className="text-on-surface-variant text-sm">
            {isLogin ? 'Log in to manage your shipments' : 'Start sharing space and saving costs'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {errors.auth && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold text-center border border-red-500/20">
              {errors.auth}
            </div>
          )}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => { setName(e.target.value); if(errors.name) setErrors({...errors, name: ''}); }}
                className={`w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all ${errors.name ? 'ring-2 ring-red-500/50 bg-red-500/5' : ''}`}
                placeholder="Alex Johnson"
              />
              {errors.name && <p className="text-xs text-red-500 font-semibold px-2 px-1">{errors.name}</p>}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: ''}); }}
              className={`w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all ${errors.email ? 'ring-2 ring-red-500/50 bg-red-500/5' : ''}`}
              placeholder="alex@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 font-semibold px-2 px-1">{errors.email}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: ''}); }}
              className={`w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary transition-all ${errors.password ? 'ring-2 ring-red-500/50 bg-red-500/5' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 font-semibold px-1">{errors.password}</p>}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
            {isLoading ? (isLogin ? 'Logging In...' : 'Creating Account...') : (isLogin ? 'Log In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
            className="text-sm font-bold text-primary hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
