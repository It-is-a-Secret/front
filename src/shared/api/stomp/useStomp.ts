import {useContext} from 'react';
import {StompContext} from './context';

export const useStomp = () => {
  const context = useContext(StompContext);
  if (!context) throw new Error('StompProvider가 필요합니다.');
  return context;
};
