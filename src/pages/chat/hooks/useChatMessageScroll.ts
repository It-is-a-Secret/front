import {useCallback, useEffect, useLayoutEffect, useRef} from 'react';

import type {ChatMessageResponse} from '@/pages/chat/api/type';

export interface UseChatMessageScrollParams {
  messages: ChatMessageResponse[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  onLoadPreviousMessages: () => Promise<unknown>;
}

export const useChatMessageScroll = ({
  messages,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  onLoadPreviousMessages,
}: UseChatMessageScrollParams) => {
  const containerRef = useRef<HTMLElement>(null);
  const loadPreviousRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const nearBottomRef = useRef(true);
  const loadingRef = useRef(false);
  const scrollSnapshotRef = useRef<{height: number; top: number} | null>(null);

  const handleLoadPreviousMessages = useCallback(async () => {
    const container = containerRef.current;
    if (!container || loadingRef.current || isFetchingNextPage || !hasNextPage)
      return;

    loadingRef.current = true;
    scrollSnapshotRef.current = {
      height: container.scrollHeight,
      top: container.scrollTop,
    };
    try {
      await onLoadPreviousMessages();
    } catch {
      scrollSnapshotRef.current = null;
    } finally {
      loadingRef.current = false;
    }
  }, [hasNextPage, isFetchingNextPage, onLoadPreviousMessages]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!initializedRef.current) {
      container.scrollTop = container.scrollHeight;
      initializedRef.current = true;
      return;
    }

    const snapshot = scrollSnapshotRef.current;
    if (snapshot) {
      container.scrollTop =
        snapshot.top + container.scrollHeight - snapshot.height;
      scrollSnapshotRef.current = null;
    } else if (nearBottomRef.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const target = loadPreviousRef.current;
    if (!target || !hasNextPage || isFetchingNextPage || isFetchNextPageError)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void handleLoadPreviousMessages();
      },
      {root: containerRef.current, rootMargin: '80px 0px 0px 0px'}
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [
    handleLoadPreviousMessages,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  ]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      nearBottomRef.current =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        80;
    }
  };

  return {
    containerRef,
    loadPreviousRef,
    handleScroll,
    handleLoadPreviousMessages,
  };
};
