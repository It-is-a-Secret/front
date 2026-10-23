import {createContext} from 'react';

export interface StompContextValue {
  status: 'connecting' | 'connected' | 'error';
  connectionId: number;
  subscribe: (
    destination: string,
    onMessage: (body: string) => void
  ) => () => void;
  publish: (destination: string, body: unknown) => boolean;
}

export const StompContext = createContext<StompContextValue | null>(null);
