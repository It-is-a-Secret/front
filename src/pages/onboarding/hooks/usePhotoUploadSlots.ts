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

const INITIAL_PHOTO_SLOTS: PhotoSlot[] = Array.from(
  {length: PHOTO_SLOT_COUNT},
  (_, index) => ({id: `photo-slot-${index + 1}`, file: null, previewUrl: null})
);

export const usePhotoUploadSlots = () => {
  const [photoSlots, setPhotoSlots] =
    useState<PhotoSlot[]>(INITIAL_PHOTO_SLOTS);
  const previewUrlsRef = useRef<Set<string>>(new Set());

  const uploadedPhotoCount = photoSlots.filter((slot) => slot.file).length;

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;

    return () => {
      previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      previewUrls.clear();
    };
  }, []);

  const handlePhotoChange = (id: string, file: File) => {
    setPhotoSlots((slots) =>
      slots.map((slot) => {
        if (slot.id !== id) {
          return slot;
        }

        if (slot.previewUrl) {
          URL.revokeObjectURL(slot.previewUrl);
          previewUrlsRef.current.delete(slot.previewUrl);
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
          URL.revokeObjectURL(slot.previewUrl);
          previewUrlsRef.current.delete(slot.previewUrl);
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
