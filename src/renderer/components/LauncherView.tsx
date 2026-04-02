import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, Settings } from 'lucide-react';
import type { LauncherItem } from '@shared/types';
import { useItemsStore } from '@/stores/items-store';
import { getElectronAPI } from '@/lib/ipc';
import { cn } from '@/lib/utils';
import { ItemIcon, typeLabel } from './ItemIcon';

export default function LauncherView() {
  const { items, initialize } = useItemsStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 初期化
  useEffect(() => {
    void initialize();
  }, [initialize]);

  // ウィンドウ表示時に検索欄をリセット・フォーカス
  useEffect(() => {
    const api = getElectronAPI();
    if (!api) return;

    const unsub = api.onShowLauncher(() => {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    });

    // 初回フォーカス
    setTimeout(() => inputRef.current?.focus(), 100);

    return unsub;
  }, []);

  // フィルタリング
  const filtered = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.path.toLowerCase().includes(q)
    );
  });

  // 選択インデックスをフィルタ結果に合わせてクランプ
  useEffect(() => {
    setSelectedIndex((prev) => (filtered.length === 0 ? 0 : Math.min(prev, filtered.length - 1)));
  }, [filtered.length]);

  // 選択アイテムを可視範囲にスクロール
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const el = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // アイテム起動
  const launch = useCallback(async (item: LauncherItem) => {
    const api = getElectronAPI();
    if (!api) return;
    await api.launchItem(item);
    // launchItem 内でランチャーが非表示になる
  }, []);

  // キーボードハンドリング
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filtered[selectedIndex]) {
            await launch(filtered[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          await getElectronAPI()?.hideLauncher();
          break;
      }
    },
    [filtered, selectedIndex, launch],
  );

  const handleOpenManagement = async () => {
    await getElectronAPI()?.openManagement();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
      {/* 検索入力エリア */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="フォルダ、アプリ、URLを検索..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* アイテムリスト */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto scrollbar-none"
      >
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center py-12 text-sm text-muted-foreground">
            {query ? `"${query}" に一致するアイテムはありません` : 'アイテムがありません'}
          </div>
        ) : (
          filtered.map((item, index) => (
            <button
              key={item.id}
              data-index={index}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                index === selectedIndex
                  ? 'border-l-2 border-primary bg-accent/60'
                  : 'border-l-2 border-transparent hover:bg-muted/50',
              )}
              onClick={() => void launch(item)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <ItemIcon type={item.type} path={item.path} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">
                  {item.name}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {item.path}
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {typeLabel(item.type)}
              </span>
            </button>
          ))
        )}
      </div>

      {/* フッター */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>← 開く</span>
          <span>↑↓ 移動</span>
          <span>Esc 閉じる</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{filtered.length}件</span>
          <button
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => void handleOpenManagement()}
          >
            <Settings className="size-3" />
            管理
          </button>
        </div>
      </div>
    </div>
  );
}
