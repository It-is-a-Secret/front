import {useRef, useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {isHTTPError} from 'ky';

import {QUERY_KEYS} from '@/shared/api/config/query-key';
import {MODERATION_MUTATION_OPTIONS} from '@/shared/api/moderation/query';
import type {ReportRequest} from '@/shared/api/moderation/type';

export const REPORT_REASONS = [
  {value: 'INAPPROPRIATE_CHAT', label: '불쾌한 대화'},
  {value: 'SEXUAL_HARASSMENT', label: '성적인 내용'},
  {value: 'COERCIVE_MEETING', label: '만남/약속 강요'},
  {value: 'DANGEROUS_PERSON', label: '위험한 사람'},
  {value: 'FINANCIAL_OR_PERSONAL_INFO_REQUEST', label: '금전·개인정보 요구'},
  {value: 'SPAM', label: '광고·홍보'},
  {value: 'ETC', label: '기타'},
] as const satisfies ReadonlyArray<{
  value: ReportRequest['reason'];
  label: string;
}>;

const getReportErrorMessage = (error: Error | null) => {
  if (!error) return null;
  if (isHTTPError(error)) {
    switch (error.response.status) {
      case 409:
        return '이미 신고한 대화예요.';
      case 403:
        return '이 대화를 신고할 권한이 없어요.';
      case 404:
        return '신고할 사용자나 채팅방을 찾을 수 없어요.';
      case 400:
        return '신고 사유와 내용을 확인해 주세요.';
    }
    return '신고를 접수하지 못했어요. 잠시 후 다시 시도해 주세요.';
  }
  return '신고 결과를 확인하지 못했어요. 네트워크 연결을 확인해 주세요.';
};

export const useChatReport = ({
  roomId,
  partnerId,
  onClose,
}: {
  roomId: number;
  partnerId: number | undefined;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const submittingRef = useRef(false);
  const [selectedReason, setSelectedReason] =
    useState<ReportRequest['reason']>('INAPPROPRIATE_CHAT');
  const [detail, setDetail] = useState('');
  const mutation = useMutation({
    ...MODERATION_MUTATION_OPTIONS.REPORT(),
    retry: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.chat.room(roomId),
      });
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.chat.rooms()});
    },
    onSettled: () => {
      submittingRef.current = false;
    },
  });
  const hasPartnerId =
    typeof partnerId === 'number' &&
    Number.isSafeInteger(partnerId) &&
    partnerId > 0;

  const handleSubmit = () => {
    if (!hasPartnerId || submittingRef.current || mutation.isSuccess) return;
    submittingRef.current = true;
    mutation.mutate({
      targetMemberId: partnerId,
      chatRoomId: roomId,
      reason: selectedReason,
      ...(detail.trim() ? {detail: detail.trim()} : {}),
    });
  };

  const handleClose = () => {
    if (submittingRef.current) return;
    onClose();
    mutation.reset();
    setSelectedReason('INAPPROPRIATE_CHAT');
    setDetail('');
  };

  return {
    selectedReason,
    setSelectedReason,
    detail,
    setDetail,
    isSubmitted: mutation.isSuccess,
    isPending: mutation.isPending,
    canSubmit: hasPartnerId && !mutation.isPending && !mutation.isSuccess,
    errorMessage: hasPartnerId
      ? getReportErrorMessage(mutation.error)
      : '상대방 정보를 확인하지 못했어요. 대화에 다시 들어와 주세요.',
    handleSubmit,
    handleClose,
  };
};
