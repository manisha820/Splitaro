import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Screen } from '../types';
import { useData } from '../contexts/DataContext';
import { supabase } from '../lib/supabase';
import { useChat } from '../contexts/ChatContext';

interface GroupDetailProps {
  onNavigate: (screen: Screen) => void;
}

export default function GroupDetail({ onNavigate }: GroupDetailProps) {
  const { selectedGroupId } = useData();
  const { startPrivateChat, setActiveConversationId } = useChat();
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedGroupId) {
      fetchGroupDetails();
    } else {
      setLoading(false);
    }
  }, [selectedGroupId]);

  const fetchGroupDetails = async () => {
    setLoading(true);
    const { data: g } = await supabase.from('groups').select('*').eq('id', selectedGroupId).single();
    if (g) setGroup(g);

    const { data: m } = await supabase
      .from('group_members')
      .select('*, profiles(full_name, avatar_url)')
      .eq('group_id', selectedGroupId);
    
    if (m) setMembers(m);
    setLoading(false);
  };

  const handleMessageUser = async (userId: string) => {
    if (startPrivateChat) {
       const convId = await startPrivateChat(userId);
       if (convId && setActiveConversationId) {
         setActiveConversationId(convId);
         onNavigate('chat');
       }
    }
  };

  const openGroupChat = async () => {
     if (selectedGroupId && setActiveConversationId) {
       const { data: conv } = await supabase.from('conversations').select('id').eq('group_id', selectedGroupId).single();
       if (conv) {
         setActiveConversationId(conv.id);
         onNavigate('chat');
       }
     }
  };

  if (loading) {
    return <div className="pt-24 px-6 text-center text-on-surface-variant font-bold">Loading Group Details...</div>;
  }

  if (!group) {
    return (
      <div className="pt-24 px-6 max-w-7xl mx-auto space-y-6 text-center">
        <p>Group not found.</p>
        <button onClick={() => onNavigate('dashboard')} className="text-primary font-bold hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto space-y-8">
      <nav className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
        <span className="cursor-pointer hover:text-primary" onClick={() => onNavigate('dashboard')}>Groups</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-primary truncate">{group.title}</span>
      </nav>

      <header className="space-y-2">
        <h2 className="text-3xl font-headline font-extrabold">{group.title}</h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Optimized shared transport targeting {group.destination}. Status: <span className="text-secondary font-bold">{group.status || 'Active'}</span>
        </p>
      </header>

      <button className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
        <span className="material-symbols-outlined">payments</span>
        Generate Deposit Link
      </button>

      {/* Route Map */}
      <div className="relative h-64 rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-inner">
        <img 
          src="https://picsum.photos/seed/germany/1200/600" 
          alt="Route Map" 
          className="w-full h-full object-cover opacity-40 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-xs font-bold text-white">Route to {group.destination}</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProgressStep icon="check_circle" label="Forming" status="completed" />
        <ProgressStep icon="handshake" label="Meeting" status="completed" />
        <ProgressStep icon="local_shipping" label="Shipped" status="current" />
        <ProgressStep icon="location_on" label="Arrived" status="pending" />
      </div>

      {/* Group Coordination */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-headline font-bold">Group Coordination</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-tertiary text-white text-[10px] font-bold">LIVE</span>
            <button 
              onClick={openGroupChat}
              className="text-primary text-xs font-bold hover:underline"
            >
              Open Full Chat
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
              <span className="material-symbols-outlined text-lg">robot_2</span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none flex-1">
              <p className="text-[10px] font-bold text-primary uppercase mb-1">System Bot</p>
              <p className="text-sm text-on-surface leading-relaxed">
                Welcome to the {group.title}! Please use the chat to coordinate pickup details. Start by tapping 'Open Full Chat'.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Roles */}
      <section className="space-y-4">
        <h3 className="text-lg font-headline font-bold">Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map(member => (
            <RoleCard 
              key={member.id} 
              icon="person" 
              role={member.role || 'Member'} 
              name={member.profiles?.full_name || 'Anonymous User'} 
              avatar={member.profiles?.avatar_url}
              onMessage={() => handleMessageUser(member.user_id)}
            />
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="bg-surface-container-low p-8 rounded-[2.5rem] space-y-4">
        <h3 className="text-lg font-headline font-bold">Resources</h3>
        <div className="space-y-2">
          <ResourceItem icon="description" label="Consolidated Bill" />
          <ResourceItem icon="qr_code_2" label={`Batch Labels (${members.length * 2})`} />
          <ResourceItem icon="verified_user" label="Insurance Details" />
        </div>
      </section>
    </div>
  );
}

function ProgressStep({ icon, label, status }: any) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  return (
    <div className={`p-6 rounded-3xl flex flex-col items-center gap-3 border transition-all ${
      isCompleted ? 'bg-white border-primary/10' : 
      isCurrent ? 'bg-white border-primary shadow-lg shadow-primary/5' : 
      'bg-surface-container-low border-transparent opacity-50'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
        isCompleted ? 'bg-primary/10 text-primary' : 
        isCurrent ? 'bg-primary text-white' : 
        'bg-surface-container text-on-surface-variant'
      }`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold">{label}</p>
      </div>
    </div>
  );
}

function RoleCard({ icon, role, name, avatar, onMessage }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between border border-transparent hover:border-primary/10 transition-all">
      <div className="flex items-center gap-4">
        {avatar ? (
          <img src={avatar} className="w-12 h-12 rounded-2xl object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
        )}
        <div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{role}</p>
          <p className="text-sm font-bold text-on-surface">{name}</p>
        </div>
      </div>
      <button 
        onClick={onMessage}
        className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
        title="Message User"
      >
        <span className="material-symbols-outlined text-sm">chat</span>
      </button>
    </div>
  );
}

function ResourceItem({ icon, label }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-primary/5 transition-colors">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </div>
  );
}
