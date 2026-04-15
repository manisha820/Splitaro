import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shipment, Match } from '../types';

interface DataContextType {
  shipments: Shipment[];
  matches: Match[];
  addShipment: (shipment: Omit<Shipment, 'id' | 'status' | 'progress'>) => void;
  joinMatch: (matchId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: '1',
      orderNumber: 'SP-8821',
      origin: 'London',
      destination: 'Berlin',
      weight: '12.5 kg',
      status: 'AI-Optimizing',
      progress: 33,
      type: 'solo'
    },
    {
      id: '2',
      orderNumber: 'SP-4109',
      origin: 'Paris',
      destination: 'New York',
      status: 'In Transit',
      weight: '4.2 kg',
      progress: 66,
      type: 'batch'
    }
  ]);

  const [matches, setMatches] = useState<Match[]>([
    {
      id: 'm1',
      title: 'Berlin Route Pool',
      subtitle: 'Join 14 others',
      score: 98,
      description: 'Matches your recurring Friday window for high-value tech cargo.',
      type: 'consolidated',
      avatars: ['https://i.pravatar.cc/100?u=1', 'https://i.pravatar.cc/100?u=2']
    }
  ]);

  const addShipment = (newShipment: Omit<Shipment, 'id' | 'status' | 'progress'>) => {
    const shipment: Shipment = {
      ...newShipment,
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: `SP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'AI-Optimizing',
      progress: 10,
    };
    setShipments(prev => [shipment, ...prev]);
    
    // Simulate finding a match after adding
    setTimeout(() => {
      const newMatch: Match = {
        id: `m-${shipment.id}`,
        title: `${shipment.destination} Route Pool`,
        subtitle: 'New Match Found!',
        score: 95,
        description: `We found 3 other users shipping to ${shipment.destination} this week.`,
        type: 'shared',
        avatars: ['https://i.pravatar.cc/100?u=a', 'https://i.pravatar.cc/100?u=b']
      };
      setMatches(prev => [newMatch, ...prev]);
    }, 2000);
  };

  const joinMatch = (matchId: string) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
    // In a real app, this would update the shipment status to 'batch'
  };

  return (
    <DataContext.Provider value={{ shipments, matches, addShipment, joinMatch }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
