import { create } from 'zustand';
import type { LauncherItem } from '@shared/types';
import { getElectronAPI } from '@/lib/ipc';

interface ItemsState {
  items: LauncherItem[];
  initialized: boolean;
  initialize: () => Promise<void>;
  setItems: (items: LauncherItem[]) => void;
  addItem: (item: Omit<LauncherItem, 'id' | 'createdAt'>) => Promise<void>;
  updateItem: (item: LauncherItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    const api = getElectronAPI();
    if (!api) return;

    const items = await api.getItems();
    set({ items, initialized: true });

    // アイテム変更をリッスン
    api.onItemsChanged((updated) => {
      set({ items: updated });
    });
  },

  setItems: (items) => set({ items }),

  addItem: async (item) => {
    await getElectronAPI()?.addItem(item);
    // items-changed イベントで自動更新
  },

  updateItem: async (item) => {
    await getElectronAPI()?.updateItem(item);
  },

  deleteItem: async (id) => {
    await getElectronAPI()?.deleteItem(id);
  },
}));
