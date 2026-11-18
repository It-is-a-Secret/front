import {createContext} from 'react';

export interface ChatRoomInputConfig {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatRoomInputContext = createContext<
  ((config: ChatRoomInputConfig | null) => () => void) | null
>(null);
