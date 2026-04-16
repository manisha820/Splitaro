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


