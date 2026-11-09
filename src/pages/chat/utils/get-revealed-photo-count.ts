import type {ChatRoomSummary} from '../api/type';

const REVEALED_PHOTO_COUNT: Record<
  NonNullable<ChatRoomSummary['progressStatus']>,
  number
> = {
  MATCHED: 0,
  PHOTO_REVEAL_STEP_1: 1,
  PHOTO_REVEAL_STEP_2: 2,
  PHOTO_REVEAL_STEP_3: 3,
  PHOTO_REVEAL_STEP_4: 4,
  COMPLETED: 5,
};

export const getRevealedPhotoCount = (
  progressStatus: ChatRoomSummary['progressStatus']
) => (progressStatus ? REVEALED_PHOTO_COUNT[progressStatus] : 0);
