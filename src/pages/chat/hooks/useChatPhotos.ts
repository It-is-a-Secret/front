import {useEffect, useMemo, useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {isHTTPError} from 'ky';

import {CHAT_QUERY_OPTIONS} from '@/pages/chat/api/query';
import type {ChatRoomSummary, RevealedImage} from '@/pages/chat/api/type';
import {getRevealedPhotoCount} from '@/pages/chat/utils/get-revealed-photo-count';
import {
  getPhotoRevealStorageKey,
  readPhotoRevealOrders,
  writePhotoRevealOrders,
} from '@/pages/chat/utils/photo-reveal-storage';
import {QUERY_KEYS} from '@/shared/api/config/query-key';

type DisplayablePhoto = RevealedImage &
  Required<Pick<RevealedImage, 'displayOrder' | 'imageUrl'>>;

const revealStorage = {
  getItem: (key: string) => window.localStorage.getItem(key),
  setItem: (key: string, value: string) =>
    window.localStorage.setItem(key, value),
};

const isPartnerPhoto = (photo: RevealedImage): photo is DisplayablePhoto =>
  photo.role === 'PARTNER' &&
  typeof photo.displayOrder === 'number' &&
  Number.isInteger(photo.displayOrder) &&
  photo.displayOrder >= 1 &&
  photo.displayOrder <= 5 &&
  typeof photo.imageUrl === 'string' &&
  photo.imageUrl.length > 0;

export const useChatPhotos = ({
  roomId,
  memberId,
  roomStatus,
  progressStatus,
}: {
  roomId: number;
  memberId: number;
  roomStatus: ChatRoomSummary['roomStatus'];
  progressStatus: ChatRoomSummary['progressStatus'];
}) => {
  const queryClient = useQueryClient();
  const active = roomStatus === 'ACTIVE';
  const imagesQuery = useQuery({
    ...CHAT_QUERY_OPTIONS.REVEALED_IMAGES(roomId),
    enabled: active,
  });
  const [acknowledged, setAcknowledged] = useState(() =>
    readPhotoRevealOrders(revealStorage, memberId, roomId)
  );
  const [dismissed, setDismissed] = useState<number[]>([]);
  const unavailable =
    isHTTPError(imagesQuery.error) &&
    [403, 404, 409].includes(imagesQuery.error.response.status);

  const photos = useMemo(() => {
    if (!active || unavailable || imagesQuery.isError) return [];
    return (imagesQuery.data?.data?.images ?? [])
      .filter(isPartnerPhoto)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [active, imagesQuery.data, imagesQuery.isError, unavailable]);

  const currentReveal = photos.find(
    (photo) =>
      photo.revealed === true &&
      photo.displayOrder <= getRevealedPhotoCount(progressStatus) &&
      !acknowledged.includes(photo.displayOrder) &&
      !dismissed.includes(photo.displayOrder)
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === getPhotoRevealStorageKey(memberId, roomId) ||
        event.key === null
      ) {
        setAcknowledged(readPhotoRevealOrders(revealStorage, memberId, roomId));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [memberId, roomId]);

  useEffect(() => {
    if (unavailable)
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.chat.room(roomId),
        exact: true,
      });
  }, [queryClient, roomId, unavailable]);

  const closeReveal = (viewed: boolean) => {
    if (!currentReveal) return;
    const order = currentReveal.displayOrder;
    if (!viewed) {
      setDismissed((previous) => [...previous, order]);
      return;
    }
    const orders = [
      ...new Set([
        ...readPhotoRevealOrders(revealStorage, memberId, roomId),
        ...acknowledged,
        order,
      ]),
    ];
    writePhotoRevealOrders(revealStorage, memberId, roomId, orders);
    setAcknowledged(orders);
  };

  return {
    photos,
    currentReveal,
    imagesQuery,
    unavailable,
    closeReveal,
  };
};
