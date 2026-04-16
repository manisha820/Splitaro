import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shipment, Match } from '../types';
import { supabase } from '../lib/supabase';

interface DataContextType {
  shipments: Shipment[];
  matches: Match[];
  addShipment: (shipment: Pick<Shipment, 'origin' | 'destination' | 'weight' | 'type'> & { description?: string }) => void;
  joinMatch: (groupId: string, shipmentId: string) => Promise<void>;
  advanceShipment: (shipmentId: string) => Promise<void>;
  selectedShipmentId: string | null;
  setSelectedShipmentId: (id: string | null) => void;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  
  // Navigation State
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // Fetch my shipments
    const { data: myShipments } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });

    if (myShipments) {
      setShipments(myShipments as Shipment[]);
      
      // Fetch open groups for matches
      const activeSoloShipments = (myShipments as Shipment[]).filter(s => s.type !== 'batch');
      
      if (activeSoloShipments.length > 0) {
        const destinations = [...new Set(activeSoloShipments.map(s => s.destination))];
        
        // Find groups going to the same destinations that I am NOT already part of
        const { data: routeGroups } = await supabase
          .from('groups')
          .select('id, title, destination, group_members(user_id)')
          .in('destination', destinations);

        if (routeGroups) {
          const generatedMatches: Match[] = [];
          
          for (const group of routeGroups) {
            // Check if I'm already in this group
            const amIMember = group.group_members?.some((m: any) => m.user_id === session.user.id);
            if (!amIMember) {
              // Find which of my shipments this matches
              const matchingShipment = activeSoloShipments.find(s => s.destination === group.destination);
              if (matchingShipment) {
                generatedMatches.push({
                  id: `match_${group.id}`,
                  groupId: group.id,
                  shipmentId: matchingShipment.id,
                  title: group.title,
                  subtitle: `Matches Route to ${group.destination}`,
                  score: 95 + Math.floor(Math.random() * 5),
                  description: `AI found a route pool for ${group.destination} arriving around your window.`,
                  type: 'shared',
                  avatars: [`https://i.pravatar.cc/100?u=${group.id.slice(0,5)}`]
                });
              }
            }
          }
          setMatches(generatedMatches);
        }
      } else {
        setMatches([]); // No solo shipments to match
      }
    }
  };

  const addShipment = async (newShipment: Pick<Shipment, 'origin' | 'destination' | 'weight' | 'type'> & { description?: string }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const ordernumber = `SP-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: shipment, error: insertError } = await supabase.from('shipments').insert({
      user_id: session.user.id,
      ordernumber: ordernumber,
      origin: newShipment.origin,
      destination: newShipment.destination,
      weight: newShipment.weight,
      status: 'AI-Optimizing',
      progress: 10,
      type: newShipment.type || 'solo',
      description: newShipment.description
    }).select().single();

    if (shipment) {
      setShipments(prev => [shipment as Shipment, ...prev]);
      
      // Auto-create a pool in the database if it doesn't exist (to simulate active community)
      const { data: existingGroup } = await supabase.from('groups').select('id').eq('destination', newShipment.destination).maybeSingle();
      
      if (!existingGroup) {
        const { data: newGroup } = await supabase.from('groups').insert({
          title: `${newShipment.destination} Route Pool`,
          destination: newShipment.destination
        }).select('id, title').single();

        if (newGroup) {
           await supabase.from('conversations').insert({
             name: newGroup.title,
             type: 'group',
             group_id: newGroup.id
           });
        }
      }

      setTimeout(fetchData, 1500);
    }
  };

  const joinMatch = async (groupId: string, shipmentId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // Insert into group_members
    await supabase.from('group_members').insert({
      group_id: groupId,
      user_id: session.user.id,
      shipment_id: shipmentId,
      role: 'Member'
    });

    // Update shipment to 'batch'
    await supabase.from('shipments').update({
      type: 'batch',
      status: 'Forming'
    }).eq('id', shipmentId);

    // Add user to Group Conversation
    const { data: conv } = await supabase.from('conversations').select('id').eq('group_id', groupId).single();
    if (conv) {
      await supabase.from('conversation_participants').insert({
        conversation_id: conv.id,
        user_id: session.user.id
      }).catch(() => {}); // catch error if already in chat
    }

    fetchData();
  };

  const advanceShipment = async (shipmentId: string) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment || shipment.progress >= 100) return;

    const newProgress = Math.min(100, shipment.progress + 30);
    let newStatus = shipment.status;

    if (newStatus === 'AI-Optimizing' && newProgress >= 40) {
      newStatus = 'In Transit';
    } else if (newProgress === 100) {
       newStatus = 'Delivered';
    }

    setShipments(current => current.map(s => 
      s.id === shipmentId ? { ...s, progress: newProgress, status: newStatus as any } : s
    ));

    await supabase.from('shipments').update({
      progress: newProgress,
      status: newStatus
    }).eq('id', shipmentId);
  };

  return (
    <DataContext.Provider value={{ 
      shipments, matches, addShipment, joinMatch, advanceShipment,
      selectedShipmentId, setSelectedShipmentId, selectedGroupId, setSelectedGroupId 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
