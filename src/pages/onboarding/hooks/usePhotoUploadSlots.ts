import {useEffect, useRef, useState} from 'react';

import {arrayMove} from '@dnd-kit/helpers';
import type {DragEndEvent} from '@dnd-kit/react';
import {isSortableOperation} from '@dnd-kit/react/sortable';

export const PHOTO_SLOT_COUNT = 5;

export interface PhotoSlot {
  id: string;
  file: File | null;
  previewUrl: string | null;
  objectKey?: string;
  imageId?: number;
  blurLevel?: number;
  processingStatus?: 'PROCESSING' | 'READY' | 'FAILED';
}

type InitialPhoto =
  | string
  | (Pick<
      PhotoSlot,
      'previewUrl' | 'objectKey' | 'blurLevel' | 'processingStatus'
    > & {id?: number});

export const createInitialPhotoSlots = (
  initialPhotos: readonly InitialPhoto[] = []
): PhotoSlot[] =>
  Array.from({length: PHOTO_SLOT_COUNT}, (_, index) => {
    const photo = initialPhotos[index];

    return {
      id: `photo-slot-${index + 1}`,
      file: null,
      previewUrl:
        typeof photo === 'string' ? photo : (photo?.previewUrl ?? null),
      ...(photo && typeof photo !== 'string'
        ? {
            objectKey: photo.objectKey,
            imageId: photo.id,
            blurLevel: photo.blurLevel,
            processingStatus: photo.processingStatus,
          }
        : {}),
    };
  });

export const usePhotoUploadSlots = (
  initialPhotos: readonly InitialPhoto[] = []
) => {
  const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>(() =>
    createInitialPhotoSlots(initialPhotos)
  );
  const previewUrlsRef = useRef<Set<string>>(new Set());

  const uploadedPhotoCount = photoSlots.filter(
    (slot) =>
      slot.file ||
      slot.previewUrl ||
      slot.objectKey ||
      slot.imageId !== undefined
  ).length;

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;

    return () => {
      previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      previewUrls.clear();
    };
  }, []);

  const revokePreviewUrl = (previewUrl: string) => {
    if (!previewUrlsRef.current.has(previewUrl)) {
      return;
    }

    URL.revokeObjectURL(previewUrl);
    previewUrlsRef.current.delete(previewUrl);
  };

  const handlePhotoChange = (id: string, file: File) => {
    setPhotoSlots((slots) =>
      slots.map((slot) => {
        if (slot.id !== id) {
          return slot;
        }

        if (slot.previewUrl) {
          revokePreviewUrl(slot.previewUrl);
        }

        const previewUrl = URL.createObjectURL(file);
        previewUrlsRef.current.add(previewUrl);

        return {
          ...slot,
          file,
          previewUrl,
          imageId: undefined,
          objectKey: undefined,
          processingStatus: undefined,
        };
      })
    );
  };

  const handlePhotoRemove = (id: string) => {
    setPhotoSlots((slots) =>
      slots.map((slot) => {
        if (slot.id !== id) {
          return slot;
        }

        if (slot.previewUrl) {
          revokePreviewUrl(slot.previewUrl);
        }

        return {
          ...slot,
          file: null,
          previewUrl: null,
          objectKey: undefined,
          imageId: undefined,
          processingStatus: undefined,
        };
      })
    );
  };

  const handlePhotoSort = (event: DragEndEvent) => {
    if (event.canceled || !isSortableOperation(event.operation)) {
      return;
    }

    const {source} = event.operation;

    if (!source) {
      return;
    }

    const {initialIndex, index} = source;

    if (initialIndex !== index) {
      setPhotoSlots((slots) => arrayMove(slots, initialIndex, index));
    }
  };

  return {
    photoSlots,
    uploadedPhotoCount,
    handlePhotoChange,
    handlePhotoRemove,
    handlePhotoSort,
  };
};
