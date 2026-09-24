import type { WishItem } from '../types/wedding';

export interface WishesService {
  list: () => Promise<WishItem[]>;
  add: (input: { name: string; message: string }) => Promise<WishItem>;
}

/**
 * Mock service — dùng mockData ban đầu, lời chúc mới thêm được lưu trong bộ nhớ
 * (mất khi reload trang). Thay bằng createRestWishesService khi có backend.
 */
function createMockWishesService(initial: WishItem[]): WishesService {
  let store = [...initial];

  return {
    async list() {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return [...store].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    },
    async add({ name, message }) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const wish: WishItem = {
        id: `wish-${Date.now()}`,
        name,
        message,
        createdAt: new Date().toISOString(),
      };
      store = [wish, ...store];
      return wish;
    },
  };
}

function createRestWishesService(endpoint: string): WishesService {
  return {
    async list() {
      const res = await fetch(endpoint);
      if (!res.ok) return [];
      return (await res.json()) as WishItem[];
    },
    async add(input) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      return (await res.json()) as WishItem;
    },
  };
}

export function getWishesService(apiEndpoint: string | undefined, mockData: WishItem[]): WishesService {
  return apiEndpoint ? createRestWishesService(apiEndpoint) : createMockWishesService(mockData);
}
