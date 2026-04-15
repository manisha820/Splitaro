import React, { createContext, useContext, useState } from 'react';
import { Message, Conversation } from '../types';

interface ChatContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string) => void;
  markAsRead: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'c1',
      name: 'Berlin Route Pool',
      lastMessage: 'Driver just confirmed departure...',
      timestamp: '10:30 AM',
      type: 'group',
      unreadCount: 2
    },
    {
      id: 'c2',
      name: 'Marcus Weber',
      lastMessage: 'I will be at the pickup point.',
      timestamp: 'Yesterday',
      type: 'private',
      avatar: 'https://i.pravatar.cc/100?u=marcus',
      unreadCount: 0
    },
    {
      id: 'c3',
      name: 'Sarah L.',
      lastMessage: 'Is the musical instrument safe?',
      timestamp: 'Monday',
      type: 'private',
      avatar: 'https://i.pravatar.cc/100?u=sarah',
      unreadCount: 0
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'c1': [
      { id: 'm1', senderId: 'u2', senderName: 'Marcus', text: 'Driver just confirmed departure from Cologne.', timestamp: '10:25 AM', isMe: false },
      { id: 'm2', senderId: 'u1', senderName: 'You', text: 'Perfect! I will be there.', timestamp: '10:30 AM', isMe: true }
    ],
    'c2': [
      { id: 'm3', senderId: 'u2', senderName: 'Marcus', text: 'I will be at the pickup point.', timestamp: 'Yesterday', isMe: false }
    ]
  });

  const sendMessage = (conversationId: string, text: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'u1',
      senderName: 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage: text, timestamp: 'Just now' } 
        : conv
    ));
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  return (
    <ChatContext.Provider value={{ conversations, messages, sendMessage, markAsRead }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
