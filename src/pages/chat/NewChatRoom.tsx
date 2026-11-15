import {useRef, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {isHTTPError} from 'ky';
import {Navigate, useNavigate, useParams} from 'react-router-dom';

import {ChatInputBox} from '@/pages/chat/components/ChatInputBox';
import {ChatImageList} from '@/pages/chat/components/ChatImageList';
import {ChatRoomState} from '@/pages/chat/components/ChatRoomState';
import {updateChatRoomPreview} from '@/pages/chat/utils/chat-room-preview';
import {
  getChatEntryPath,
  getStartChatDraft,
} from '@/pages/chat/model/chat-entry';
import {HOME_MUTATION_OPTIONS} from '@/pages/home/api/query';
import {PROFILE_QUERY_OPTIONS} from '@/pages/profile/api/query';
import {QUERY_KEYS} from '@/shared/api';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

export const NewChatRoom = () => {
  const {feedId: feedIdParam} = useParams();
  const feedId = Number(feedIdParam);
  if (!Number.isSafeInteger(feedId) || feedId <= 0) {
    return <ChatRoomState title='올바르지 않은 프로필이에요.' />;
  }
  return <NewChatRoomContent key={feedId} feedId={feedId} />;
};

const NewChatRoomContent = ({feedId}: {feedId: number}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const detailQuery = useQuery(PROFILE_QUERY_OPTIONS.DETAIL(feedId));
  const imagesQuery = useQuery(PROFILE_QUERY_OPTIONS.IMAGES(feedId));
  const [message, setMessage] = useState('');
  const submittingRef = useRef(false);
  const mutation = useMutation({
    ...HOME_MUTATION_OPTIONS.START_CHAT(),
    onSuccess: async (response, variables) => {
      await queryClient.cancelQueries({queryKey: QUERY_KEYS.chat.rooms()});
      if (response.data.created && response.data.firstMessage) {
        updateChatRoomPreview(
          queryClient,
          response.data.roomId,
          response.data.firstMessage,
          {
            roomId: response.data.roomId,
            partnerNickname: detailQuery.data?.data?.nickName,
            roomStatus: 'ACTIVE',
            progressStatus: 'MATCHED',
            unreadCount: 0,
          }
        );
      }
      // 첫 메시지는 REST에서 이미 저장하므로 STOMP로 다시 보내지 않습니다.
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.chat.all});
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.discovery.all});
      void navigate(`/chat/${response.data.roomId}`, {
        replace: true,
        state: {
          draftMessage: getStartChatDraft(
            response.data.created,
            variables.body.message
          ),
        },
      });
    },
    onError: (error) => {
      if (isHTTPError(error) && [404, 409].includes(error.response.status)) {
        void queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.discovery.all,
        });
      }
    },
    onSettled: () => {
      submittingRef.current = false;
    },
  });
  const profile = detailQuery.data?.data;
  const errorStatus = isHTTPError(mutation.error)
    ? mutation.error.response.status
    : undefined;
  const cannotStart =
    errorStatus === 403 || errorStatus === 404 || errorStatus === 409;

  if (detailQuery.isError) {
    return (
      <ChatRoomState
        title='상대방 정보를 불러오지 못했어요.'
        onRetry={() => void detailQuery.refetch()}
        isRetrying={detailQuery.isFetching}
      />
    );
  }
  if (detailQuery.isPending) {
    return (
      <p
        role='status'
        className='text-body1-15r py-[4rem] text-center text-gray-600'>
        대화를 불러오고 있어요.
      </p>
    );
  }

  const entryPath = getChatEntryPath(feedId, profile?.chatRoom);
  if (entryPath !== `/chat/new/${feedId}` && !mutation.isPending) {
    return <Navigate to={entryPath} replace state={{draftMessage: message}} />;
  }

  const photos = (imagesQuery.data?.data?.images ?? []).flatMap((image) =>
    image.variantUrl
      ? [
          {
            ...image,
            role: 'PARTNER' as const,
            revealed: false,
            imageUrl: image.variantUrl,
          },
        ]
      : []
  );

  return (
    <section className='relative flex h-dvh flex-col'>
      <Header
        className='px-[2rem]'
        leftItem={<IcSvgLeft className='size-[2.4rem] text-gray-800' />}
        onClickLeft={() => navigate(-1)}
        title={
          <div className='flex items-center gap-[0.8rem]'>
            <h1 className='text-title-18b text-gray-800'>
              {profile?.nickName ?? '상대방'}
            </h1>
            <span className='bg-primary text-button2-10r text-white-800 rounded-full px-[0.6rem] py-[0.1rem]'>
              0/5
            </span>
          </div>
        }
      />
      {photos.length > 0 && (
        <ChatImageList
          photos={photos}
          refreshKey={imagesQuery.dataUpdatedAt}
          onRefresh={() => void imagesQuery.refetch()}
          isRefreshing={imagesQuery.isFetching}
        />
      )}
      <main className='flex min-h-0 flex-1 flex-col'>
        <section
          aria-label='대화 내역'
          className='min-h-0 flex-1 overflow-y-auto px-[2rem] py-[2.4rem]'>
          <p className='text-body1-15r py-[2.4rem] text-center text-gray-600'>
            아직 메시지가 없어요.
          </p>
        </section>
        {mutation.isError && (
          <div
            role='alert'
            className='text-body1-15r px-[2rem] py-[0.8rem] text-center text-gray-600'>
            {cannotStart
              ? '지금은 대화를 시작할 수 없어요. 홈에서 다시 확인해 주세요.'
              : errorStatus === 400
                ? '보낼 메시지를 확인해 주세요.'
                : '전송 결과를 확인하지 못했어요. 연결을 확인하고 다시 시도해 주세요.'}
            {cannotStart && (
              <button
                type='button'
                className='text-primary block w-full py-[0.8rem]'
                onClick={() => navigate('/home', {replace: true})}>
                홈으로 돌아가기
              </button>
            )}
          </div>
        )}
        {mutation.isPending && (
          <p
            role='status'
            className='text-body1-15r px-[2rem] text-center text-gray-600'>
            메시지를 보내고 있어요.
          </p>
        )}
        <ChatInputBox
          value={message}
          onValueChange={setMessage}
          inputProps={{
            disabled: mutation.isPending || cannotStart,
            onKeyDown: (event) => {
              if (event.key === 'Enter' && event.nativeEvent.isComposing)
                event.preventDefault();
            },
          }}
          submitDisabled={
            mutation.isPending || cannotStart || !message.trim() || !profile
          }
          onSubmit={(event) => {
            event.preventDefault();
            if (
              !profile ||
              !message.trim() ||
              cannotStart ||
              submittingRef.current
            )
              return;
            submittingRef.current = true;
            mutation.mutate({feedId, body: {message: message.trim()}});
          }}
        />
      </main>
    </section>
  );
};
