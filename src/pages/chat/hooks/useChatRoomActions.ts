import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {isHTTPError} from 'ky';

import {CHAT_MUTATION_OPTIONS} from '@/pages/chat/api/query';
import type {GetChatRoomsResponse} from '@/pages/chat/api/type';
import {QUERY_KEYS} from '@/shared/api/config/query-key';
import {MODERATION_MUTATION_OPTIONS} from '@/shared/api/moderation/query';

type ChatRoomAction = 'report' | 'block' | 'leave';

const getActionErrorMessage = (
  error: Error | null,
  action: ChatRoomAction | null
) => {
  if (!error) return null;
  if (isHTTPError(error)) {
    if (error.response.status === 403) return '이 작업을 수행할 권한이 없어요.';
    if (error.response.status === 404)
      return '사용자나 채팅방을 찾을 수 없어요. 목록에서 다시 확인해 주세요.';
    if (error.response.status === 409)
      return '대화 상태가 변경됐어요. 목록에서 다시 확인해 주세요.';
    if (error.response.status === 400) return '요청 정보를 확인하지 못했어요.';
    return action === 'block'
      ? '차단하지 못했어요. 잠시 후 다시 시도해 주세요.'
      : '채팅방을 나가지 못했어요. 잠시 후 다시 시도해 주세요.';
  }
  return '처리 결과를 확인하지 못했어요. 네트워크 연결을 확인해 주세요.';
};

export const useChatRoomActions = ({
  roomId,
  partnerId,
}: {
  roomId: number;
  partnerId: number | undefined;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ChatRoomAction | null>(null);
  const completeAction = async (action: 'block' | 'leave') => {
    await Promise.all([
      queryClient.cancelQueries({queryKey: QUERY_KEYS.chat.room(roomId)}),
      queryClient.cancelQueries({queryKey: QUERY_KEYS.chat.rooms()}),
    ]);
    queryClient.setQueryData<GetChatRoomsResponse>(
      QUERY_KEYS.chat.rooms(),
      (old) =>
        old
          ? {
              ...old,
              data: old.data?.filter(
                (room) =>
                  room.roomId !== roomId &&
                  !(action === 'block' && room.partnerId === partnerId)
              ),
            }
          : old
    );
    queryClient.removeQueries({queryKey: QUERY_KEYS.chat.room(roomId)});
    void queryClient.invalidateQueries({queryKey: QUERY_KEYS.chat.rooms()});
    if (action === 'block') {
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.discovery.all});
    }
    navigate('/chat', {
      replace: true,
      state: {
        toastMessage:
          action === 'block' ? '차단이 완료되었어요' : '채팅방을 나갔어요',
      },
    });
  };
  const onSettled = () => {
    submittingRef.current = false;
  };
  const blockMutation = useMutation({
    ...MODERATION_MUTATION_OPTIONS.BLOCK(),
    retry: false,
    onSuccess: () => completeAction('block'),
    onSettled,
  });
  const leaveMutation = useMutation({
    ...CHAT_MUTATION_OPTIONS.LEAVE(),
    retry: false,
    onSuccess: () => completeAction('leave'),
    onSettled,
  });
  const isPending = blockMutation.isPending || leaveMutation.isPending;
  const hasPartnerId =
    typeof partnerId === 'number' &&
    Number.isSafeInteger(partnerId) &&
    partnerId > 0;
  const resetMutations = () => {
    blockMutation.reset();
    leaveMutation.reset();
  };

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
    if (submittingRef.current) return;
    resetMutations();
    setIsActionMenuOpen(false);
    setActiveAction(action);
  };

  const confirmAction = () => {
    if (submittingRef.current) return;
    if (activeAction === 'block') {
      if (!hasPartnerId) return;
      submittingRef.current = true;
      blockMutation.mutate({targetMemberId: partnerId});
    } else if (activeAction === 'leave') {
      submittingRef.current = true;
      leaveMutation.mutate(roomId);
    }
  };

  const closeAction = () => {
    if (submittingRef.current) return;
    setActiveAction(null);
    resetMutations();
  };

  return {
    actionMenuRef,
    isActionMenuOpen,
    activeAction,
    isPending,
    canConfirm: !isPending && (activeAction !== 'block' || hasPartnerId),
    errorMessage:
      activeAction === 'block' && !hasPartnerId
        ? '상대방 정보를 확인하지 못했어요. 대화에 다시 들어와 주세요.'
        : getActionErrorMessage(
            blockMutation.error ?? leaveMutation.error,
            activeAction
          ),
    toggleMenu: () => setIsActionMenuOpen((previous) => !previous),
    openAction,
    closeAction,
    confirmAction,
  };
};
