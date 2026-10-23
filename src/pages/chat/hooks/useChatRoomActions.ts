import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useToast} from '@/shared/hooks/useToast';

type ChatRoomAction = 'report' | 'block' | 'leave';

export const useChatRoomActions = (onBlocked: () => void) => {
  const navigate = useNavigate();
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ChatRoomAction | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isActionMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!actionMenuRef.current?.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isActionMenuOpen]);

  const openAction = (action: ChatRoomAction) => {
    setIsActionMenuOpen(false);
    setActiveAction(action);
  };

  // 신고·차단·나가기 API 연결 전까지 기존 화면 동작을 유지합니다.
  const confirmAction = () => {
    if (activeAction === 'block') {
      setActiveAction(null);
      setIsBlocked(true);
      onBlocked();
      toast.showToast();
    } else if (activeAction === 'leave') {
      setActiveAction(null);
      navigate('/chat', {state: {toastMessage: '채팅방을 나갔어요'}});
    }
  };

  return {
    actionMenuRef,
    isActionMenuOpen,
    activeAction,
    isBlocked,
    toast,
    toggleMenu: () => setIsActionMenuOpen((previous) => !previous),
    openAction,
    closeAction: () => setActiveAction(null),
    confirmAction,
  };
};
