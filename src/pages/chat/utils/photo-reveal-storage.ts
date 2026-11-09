export const getPhotoRevealStorageKey = (memberId: number, roomId: number) =>
  `chat-photo-reveal:v1:${memberId}:${roomId}`;

export const readPhotoRevealOrders = (
  storage: Pick<Storage, 'getItem'>,
  memberId: number,
  roomId: number
): number[] => {
  try {
    const value: unknown = JSON.parse(
      storage.getItem(getPhotoRevealStorageKey(memberId, roomId)) ?? '[]'
    );
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (order): order is number =>
                typeof order === 'number' &&
                Number.isInteger(order) &&
                order >= 1 &&
                order <= 5
            )
          ),
        ]
      : [];
  } catch {
    return [];
  }
};

export const writePhotoRevealOrders = (
  storage: Pick<Storage, 'setItem'>,
  memberId: number,
  roomId: number,
  orders: number[]
) => {
  try {
    storage.setItem(
      getPhotoRevealStorageKey(memberId, roomId),
      JSON.stringify(orders)
    );
  } catch {
    // 저장소 사용이 제한돼도 현재 화면에서의 확인 처리는 유지합니다.
  }
};
