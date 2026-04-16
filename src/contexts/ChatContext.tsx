import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Conversation } from '../types';
import { supabase } from '../lib/supabase';

interface ChatContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  startPrivateChat: (userId: string) => Promise<string | null>;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  fetchChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const userId = session.user.id;

    // Get all conversations I am part of
    const { data: parts } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);

    if (!parts || parts.length === 0) {
      setConversations([]);
      return;
    }

    const conversationIds = parts.map(p => p.conversation_id);

    // Fetch conversation details.
    const { data: convs } = await supabase
      .from('conversations')
      .select('*, conversation_participants(user_id, profiles(full_name, avatar_url))')
      .in('id', conversationIds)
      .order('created_at', { ascending: false });

    if (convs) {
      const formattedConvs: Conversation[] = convs.map(c => {
        let name = c.name;
        let avatar = undefined;

        if (c.type === 'private') {
           const otherParticipant = c.conversation_participants?.find((p: any) => p.user_id !== userId);
           if (otherParticipant && otherParticipant.profiles) {
             name = otherParticipant.profiles.full_name;
             avatar = otherParticipant.profiles.avatar_url;
           }
        }

        return {
          id: c.id,
          name: name || 'Chat',
          lastMessage: 'Tap to view messages...',
          timestamp: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: c.type,
          avatar,
          unreadCount: 0
        };
      });

      // Fetch ALL messages for these conversations
      const { data: msgs } = await supabase
        .from('messages')
        .select('*, profiles:sender_id(full_name)')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: true });

      if (msgs) {
        const msgsDict: Record<string, Message[]> = {};
        msgs.forEach(m => {
          if (!msgsDict[m.conversation_id]) msgsDict[m.conversation_id] = [];
          msgsDict[m.conversation_id].push({
            id: m.id,
            senderId: m.sender_id,
            senderName: m.profiles?.full_name || 'User',
            text: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: m.sender_id === userId
          });
        });

        // Update lastMessage on conversations based on actual messages
        const updatedConvs = formattedConvs.map(c => {
           const cMsgs = msgsDict[c.id];
           if (cMsgs && cMsgs.length > 0) {
              const lastM = cMsgs[cMsgs.length - 1];
              return { ...c, lastMessage: lastM.text, timestamp: lastM.timestamp };
           }
           return c;
        });
        
        setMessages(msgsDict);
        setConversations(updatedConvs);
      } else {
        setConversations(formattedConvs);
      }
    }
  };

  const sendMessage = async (conversationId: string, text: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: session.user.id,
      content: text
    });

    await fetchChats();
  };

  const markAsRead = (conversationId: string) => {
    // mock for now
  };

  const startPrivateChat = async (targetUserId: string): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    const myId = session.user.id;
    if (myId === targetUserId) return null; // Can't chat with yourself

    // 1. Check if private chat already exists between these two
    const { data: myPrivateChats } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', myId);
      
    if (myPrivateChats && myPrivateChats.length > 0) {
      const chatIds = myPrivateChats.map(c => c.conversation_id);
      const { data: existingTargetParts } = await supabase
        .from('conversation_participants')
        .select('conversation_id, conversations!inner(type)')
        .eq('user_id', targetUserId)
        .eq('conversations.type', 'private')
        .in('conversation_id', chatIds);

      if (existingTargetParts && existingTargetParts.length > 0) {
        return existingTargetParts[0].conversation_id;
      }
    }

    // 2. Create new private chat
    const { data: newConv } = await supabase.from('conversations').insert({
      type: 'private'
    }).select('id').single();

    if (newConv) {
      await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: myId },
        { conversation_id: newConv.id, user_id: targetUserId }
      ]);
      await fetchChats();
      return newConv.id;
    }
    
    return null;
  };

  return (
    <ChatContext.Provider value={{ 
      conversations, messages, sendMessage, markAsRead, startPrivateChat,
      activeConversationId, setActiveConversationId, fetchChats
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
