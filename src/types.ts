export type Screen = 'landing' | 'dashboard' | 'tracker' | 'group-detail' | 'chat';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  type: 'private' | 'group';
  avatar?: string;
  unreadCount: number;
}

export interface Shipment {
  id: string;
  orderNumber: string;
  origin: string;
  destination: string;
  weight: string;
  status: 'AI-Optimizing' | 'In Transit' | 'Delivered' | 'Forming';
  statusText?: string;
  eta?: string;
  progress: number;
  type: 'batch' | 'solo';
}

export interface Match {
  id: string;
  title: string;
  subtitle: string;
  score: number;
  description: string;
  type: 'consolidated' | 'shared' | 'power';
  avatars?: string[];
}

export interface TimelineStep {
  title: string;
  date?: string;
  time?: string;
  status: 'completed' | 'current' | 'pending';
  description?: string;
  tags?: string[];
}
