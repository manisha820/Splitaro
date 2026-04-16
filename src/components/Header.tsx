import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Header({ currentScreen, onNavigate }: HeaderProps) {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  const getTitle = () => {
    switch (currentScreen) {
      case 'dashboard': return 'Dashboard';
      case 'tracker': return 'Shipment Tracker';
      case 'group-detail': return 'Group Details';
      case 'chat': return 'Messages';
      default: return 'Splitaro AI';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
        </div>
        <h1 className="text-xl font-headline font-extrabold tracking-tight bg-gradient-to-br from-primary to-tertiary bg-clip-text text-transparent">
          {getTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('chat')}
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors relative"
        >
          <span className="material-symbols-outlined">chat_bubble</span>
          <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></div>
        </button>
        <div className="relative">
          <div 
            className="w-10 h-10 rounded-full bg-surface-container overflow-hidden ring-2 ring-white shadow-sm cursor-pointer" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt0OfrGAQ8lYruBiDqqDTuTuw4hTMHO4vHsvqICGgHOQk0KCU9Y0bXEymI-m85MBEVQS9qd7rVGKrYAklhHjGc9buaSK7NKgCgh4m5nOVVz1b3ZPlkAg9z1M5bTlZ5r3zTA_-WxCu8XAA_Lgun2j8ZFZUgEvKg-AGFj3nAfv7WsmnUX70iv3BwoIcVTkEqPCmwc5GFjiOVm2N34O7_OS-tvCWpgasx-d7sTFzgtHZmC5VwGoo67Konf3bPzxuR7qmjcPhLOqfOT-ie" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 right-0 w-48 bg-white rounded-2xl shadow-xl z-50 overflow-hidden border border-surface-container"
                >
                  <button 
                    onClick={() => { setDropdownOpen(false); onNavigate('dashboard'); }}
                    className="w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors text-sm font-bold flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">dashboard</span>
                    Dashboard
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-500/10 transition-colors text-sm font-bold text-red-500 flex items-center gap-2 border-t border-surface-container-low"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
