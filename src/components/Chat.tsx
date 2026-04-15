import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useChat } from '../contexts/ChatContext';
import { Conversation, Message } from '../types';

export default function Chat() {
  const { conversations, messages, sendMessage, markAsRead } = useChat();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  useEffect(() => {
    if (activeConversationId) {
      markAsRead(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && activeConversationId) {
      sendMessage(activeConversationId, inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto h-[calc(100vh-180px)] flex flex-col">
      <AnimatePresence mode="wait">
        {!activeConversationId ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 space-y-4 overflow-y-auto pb-4"
          >
            <h2 className="text-3xl font-headline font-extrabold mb-6">Messages</h2>
            {conversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className="bg-white p-4 rounded-3xl shadow-sm flex items-center gap-4 cursor-pointer hover:bg-primary/5 transition-all border border-transparent hover:border-primary/10"
              >
                <div className="relative">
                  {conv.avatar ? (
                    <img src={conv.avatar} alt={conv.name} className="w-14 h-14 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-3xl">groups</span>
                    </div>
                  )}
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold truncate">{conv.name}</h4>
                    <span className="text-[10px] text-on-surface-variant font-medium">{conv.timestamp}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant truncate">{conv.lastMessage}</p>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-sm overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 border-bottom flex items-center gap-4 bg-surface-container-low">
              <button 
                onClick={() => setActiveConversationId(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div className="flex items-center gap-3">
                {activeConversation?.avatar ? (
                  <img src={activeConversation.avatar} alt={activeConversation.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm">{activeConversation?.name}</h4>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                    {activeConversation?.type === 'group' ? 'Group Chat' : 'Private Chat'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.map((msg, i) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.isMe 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-surface-container-low text-on-surface rounded-tl-none'
                  }`}>
                    {!msg.isMe && activeConversation?.type === 'group' && (
                      <p className="text-[10px] font-bold text-primary uppercase mb-1">{msg.senderName}</p>
                    )}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[9px] mt-1 ${msg.isMe ? 'text-white/60' : 'text-on-surface-variant'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-surface-container-low flex gap-2">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-5 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-primary transition-all text-sm"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
