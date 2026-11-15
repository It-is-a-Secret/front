import assert from 'node:assert/strict';
import {test} from 'node:test';
import {InfiniteQueryObserver, QueryClient} from '@tanstack/react-query';

import {discoveryInfiniteQueryOptions} from '../src/pages/home/model/discovery-pagination';

test('uses the server default of 20 on every page without skipping or repeating members', async () => {
  const client = new QueryClient({
    defaultOptions: {queries: {retry: false, gcTime: 0}},
  });
  const members = Array.from({length: 43}, (_, i) => ({feedId: i + 1}));
  const requests: {page: number; size: number}[] = [];
  const observer = new InfiniteQueryObserver(
    client,
    discoveryInfiniteQueryOptions(async (params) => {
      const page = params?.page ?? 0;
      assert.equal(Object.hasOwn(params ?? {}, 'size'), false);
      const size = params?.size ?? 20;
      requests.push({page, size});
      return {data: members.slice(page * size, (page + 1) * size)};
    })
  );
  try {
    let result = await observer.refetch();
    assert.equal(result.data?.pages[0].data?.length, 20);
    while (result.hasNextPage) result = await observer.fetchNextPage();
    assert.deepEqual(requests, [
      {page: 0, size: 20},
      {page: 1, size: 20},
      {page: 2, size: 20},
      {page: 3, size: 20},
    ]);
    assert.deepEqual(
      result.data?.pages.flatMap((page) => page.data ?? []),
      members
    );
  } finally {
    client.clear();
  }
});

test('continues after partial pages and stops only after an empty page', async () => {
  const client = new QueryClient({
    defaultOptions: {queries: {retry: false, gcTime: 0}},
  });
  const requests: number[] = [];
  const observer = new InfiniteQueryObserver(
    client,
    discoveryInfiniteQueryOptions(async (params) => {
      const page = params?.page ?? 0;
      assert.equal(params?.size, undefined);
      requests.push(page);
      return {
        data: Array.from(
          {length: ({0: 20, 1: 3, 2: 2} as Record<number, number>)[page] ?? 0},
          (_, i) => ({
            feedId: page * 20 + i + 1,
          })
        ),
      };
    })
  );
  try {
    await observer.refetch();
    const partial = await observer.fetchNextPage();
    assert.equal(partial.hasNextPage, true);
    const next = await observer.fetchNextPage();
    assert.equal(next.hasNextPage, true);
    const result = await observer.fetchNextPage();
    assert.deepEqual(requests, [0, 1, 2, 3]);
    assert.equal(
      result.data?.pages.flatMap((page) => page.data ?? []).length,
      25
    );
    assert.equal(result.hasNextPage, false);
    await observer.fetchNextPage();
    assert.deepEqual(requests, [0, 1, 2, 3]);
  } finally {
    client.clear();
  }
});

test('keeps existing cards on next-page failure and retries the same page', async () => {
  const client = new QueryClient({
    defaultOptions: {queries: {retry: false, gcTime: 0}},
  });
  let fail = true;
  const requests: number[] = [];
  const observer = new InfiniteQueryObserver(
    client,
    discoveryInfiniteQueryOptions(async (params) => {
      const page = params?.page ?? 0;
      requests.push(page);
      if (page === 1 && fail) throw new Error('network failure');
      return {
        data:
          page === 0
            ? Array.from({length: 20}, (_, i) => ({feedId: i + 1}))
            : [],
      };
    })
  );
  try {
    await observer.refetch();
    const failed = await observer.fetchNextPage();
    assert.equal(failed.isFetchNextPageError, true);
    assert.equal(failed.data?.pages[0].data?.length, 20);
    fail = false;
    const recovered = await observer.fetchNextPage();
    assert.deepEqual(requests, [0, 1, 1]);
    assert.equal(recovered.hasNextPage, false);
    assert.equal(recovered.isError, false);
  } finally {
    client.clear();
  }
});
