import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Search, Settings, Star, FolderOpen, Monitor, Globe, FileText } from 'lucide-react';
import type { LauncherItem, ItemType } from '@shared/types';
import { useItemsStore } from '@/stores/items-store';
import { getElectronAPI } from '@/lib/ipc';
import { cn } from '@/lib/utils';
import { ItemIcon, typeLabel } from './ItemIcon';

type FilterType = 'all' | ItemType;

const FILTERS: { key: FilterType; label: string; icon: typeof Globe }[] = [
  { key: 'all',     label: 'すべて',      icon: Globe },
  { key: 'app',     label: 'アプリ',      icon: Monitor },
  { key: 'folder',  label: 'フォルダ',    icon: FolderOpen },
  { key: 'url',     label: 'URL',         icon: Globe },
  { key: 'snippet', label: 'スニペット',  icon: FileText },
];

function sortItems(items: LauncherItem[]): LauncherItem[] {
  return [...items].sort((a, b) => {
    // ピン留めアイテムを上位に、それ以外は登録順を維持
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return 0;
  });
}

export default function LauncherView() {
  const { items, initialize, togglePin } = useItemsStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  // ウィンドウ表示時に検索欄をリセット・フォーカス
  useEffect(() => {
    const api = getElectronAPI();
    if (!api) return;

    const unsub = api.onShowLauncher(() => {
      setQuery('');
      setFilter('all');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    });

    setTimeout(() => inputRef.current?.focus(), 100);

    return unsub;
  }, []);

  // フィルタリング + ソート
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const result = items.filter((item) => {
      if (filter !== 'all' && item.type !== filter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        (item.content?.toLowerCase().includes(q) ?? false)
      );
    });
    return sortItems(result);
  }, [items, query, filter]);

  // ピン留めアイテムと通常アイテムの境界インデックス
  const pinnedCount = useMemo(
    () => filtered.filter((i) => i.pinned).length,
    [filtered],
  );

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

  // アイテム起動 / スニペットコピー
  const launch = useCallback(async (item: LauncherItem) => {
    const api = getElectronAPI();
    if (!api) return;
    if (item.type === 'snippet') {
      await api.pasteSnippet(item.content ?? '');
    } else {
      await api.launchItem(item);
    }
  }, []);

  // ピン留めトグル
  const handleTogglePin = useCallback(async (id: string) => {
    await togglePin(id);
  }, [togglePin]);

  // フィルタ切替
  const cycleFilter = useCallback((direction: 1 | -1) => {
    setFilter((prev) => {
      const idx = FILTERS.findIndex((f) => f.key === prev);
      const next = (idx + direction + FILTERS.length) % FILTERS.length;
      return FILTERS[next].key;
    });
    setSelectedIndex(0);
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
        case 'ArrowRight':
          if (query === '') {
            e.preventDefault();
            cycleFilter(1);
          }
          break;
        case 'ArrowLeft':
          if (query === '') {
            e.preventDefault();
            cycleFilter(-1);
          }
          break;
        case 'Tab':
          e.preventDefault();
          cycleFilter(e.shiftKey ? -1 : 1);
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
        case 'd':
          // Ctrl+D でピン留めトグル
          if (e.ctrlKey && filtered[selectedIndex]) {
            e.preventDefault();
            await handleTogglePin(filtered[selectedIndex].id);
          }
          break;
      }
    },
    [filtered, selectedIndex, launch, handleTogglePin, cycleFilter, query],
  );

  const handleOpenManagement = async () => {
    await getElectronAPI()?.openManagement();
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-background shadow-2xl ring-1 ring-foreground/10"
      onMouseDown={(e) => {
        // ボタン・input 以外のクリックではフォーカス移動を抑止し、検索欄にフォーカスを保持
        const target = e.target as HTMLElement;
        if (!target.closest('button, input')) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }}
    >
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

      {/* フィルタチップ */}
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2">
        {FILTERS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              filter === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            onClick={() => {
              setFilter(key);
              setSelectedIndex(0);
              inputRef.current?.focus();
            }}
            tabIndex={-1}
          >
            <Icon className="size-3" />
            {label}
          </button>
        ))}
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
            <div key={item.id}>
              {/* ピン留めと通常アイテムの境界セパレータ */}
              {pinnedCount > 0 && index === pinnedCount && (
                <div className="mx-4 border-t border-dashed border-border/60" />
              )}
              <div
                data-index={index}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors',
                  index === selectedIndex
                    ? 'border-l-2 border-primary bg-accent/60'
                    : 'border-l-2 border-transparent hover:bg-muted/50',
                )}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => void launch(item)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <ItemIcon type={item.type} path={item.path} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {item.name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {item.type === 'snippet'
                      ? (item.content?.slice(0, 60) ?? '') + (item.content && item.content.length > 60 ? '…' : '')
                      : item.path}
                  </div>
                </div>

                {/* ピン留めインジケータ / トグル */}
                <button
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-md transition-colors',
                    item.pinned
                      ? 'text-amber-500 hover:text-amber-600'
                      : index === selectedIndex
                        ? 'text-muted-foreground/40 hover:text-amber-400'
                        : 'text-transparent',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleTogglePin(item.id);
                    inputRef.current?.focus();
                  }}
                  tabIndex={-1}
                  aria-label={item.pinned ? 'ピン留め解除' : 'ピン留め'}
                >
                  <Star className={cn('size-3.5', item.pinned && 'fill-current')} />
                </button>

                <span className="shrink-0 text-xs text-muted-foreground">
                  {typeLabel(item.type)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* フッター */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>↵ {filtered[selectedIndex]?.type === 'snippet' ? '貼り付け' : '開く'}</span>
          <span>↑↓ 移動</span>
          <span>Tab 絞込</span>
          <span>Ctrl+D ピン</span>
          <span>Esc 閉じる</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{filtered.length}件</span>
          <button
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => void handleOpenManagement()}
            tabIndex={-1}
          >
            <Settings className="size-3" />
            管理
          </button>
        </div>
      </div>
    </div>
  );
}
