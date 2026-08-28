import {useEffect, useRef, useState} from 'react';

import {arrayMove} from '@dnd-kit/helpers';
import type {DragEndEvent} from '@dnd-kit/react';
import {isSortableOperation} from '@dnd-kit/react/sortable';

export const PHOTO_SLOT_COUNT = 5;

export interface PhotoSlot {
  id: string;
  file: File | null;
  previewUrl: string | null;
}

const createInitialPhotoSlots = (
  initialPreviewUrls: readonly string[] = []
): PhotoSlot[] =>
  Array.from({length: PHOTO_SLOT_COUNT}, (_, index) => ({
    id: `photo-slot-${index + 1}`,
    file: null,
    previewUrl: initialPreviewUrls[index] ?? null,
  }));

export const usePhotoUploadSlots = (
  initialPreviewUrls: readonly string[] = []
) => {
  const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>(() =>
    createInitialPhotoSlots(initialPreviewUrls)
  );
  const previewUrlsRef = useRef<Set<string>>(new Set());

  const uploadedPhotoCount = photoSlots.filter((slot) => slot.previewUrl).length;

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
