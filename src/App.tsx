/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen } from './types';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Tracker from './components/Tracker';
import GroupDetail from './components/GroupDetail';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Auth from './components/Auth';
import Chat from './components/Chat';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ChatProvider } from './contexts/ChatContext';
import { isSupabaseConfigured } from './lib/supabase';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <Landing onNavigate={setCurrentScreen} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentScreen} />;
      case 'tracker':
        return <Tracker onNavigate={setCurrentScreen} />;
      case 'group-detail':
        return <GroupDetail onNavigate={setCurrentScreen} />;
      case 'chat':
        return <Chat />;
      default:
        return <Landing onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      
      <main className="flex-1 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }} // faster transitions
            className="w-full min-h-screen bg-surface"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center text-red-400">
        <div className="bg-surface-light border border-red-500/30 p-8 rounded-2xl max-w-md shadow-xl">
          <h1 className="text-3xl font-bold mb-4 text-red-500">Configuration Error</h1>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Please configure <code className="bg-surface px-2 py-1 rounded text-red-400">VITE_SUPABASE_URL</code> and <code className="bg-surface px-2 py-1 rounded text-red-400">VITE_SUPABASE_ANON_KEY</code> in your Vercel project settings to run the app.
          </p>
          <a
            href="https://vercel.com/docs/projects/environment-variables"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white font-medium py-2 px-6 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Learn more
          </a>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <DataProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </DataProvider>
    </AuthProvider>
  );
}


