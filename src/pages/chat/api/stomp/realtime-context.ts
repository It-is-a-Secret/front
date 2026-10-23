import {createContext} from 'react';
import type {ChatServerError} from './event';

export const ChatRealtimeContext = createContext<{
  subscribeErrors: (listener: (error: ChatServerError) => void) => () => void;
} | null>(null);
