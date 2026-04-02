import { useState, useEffect, useRef } from 'react';
import { Search, Monitor, Loader2 } from 'lucide-react';
import type { InstalledApp } from '@shared/types';
import { getElectronAPI } from '@/lib/ipc';
import { useFileIcon } from '@/hooks/useFileIcon';
import { cn } from '@/lib/utils';

interface AppPickerDialogProps {
  onSelect: (app: InstalledApp) => void;
  onClose: () => void;
}

// ─── 行アイテム (アイコンの遅延取得はここで行う) ────────────────
function AppRow({
  app,
  index,
  isSelected,
  onSelect,
  onHover,
}: {
  app: InstalledApp;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  const icon = useFileIcon(app.path);

  return (
    <button
      data-idx={index}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
        isSelected
          ? 'border-l-2 border-primary bg-accent/60'
          : 'border-l-2 border-transparent hover:bg-muted/50',
      )}
      onClick={onSelect}
      onMouseEnter={onHover}
    >
      {/* アイコン */}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/50">
        {icon ? (
          <img src={icon} alt="" className="size-5 object-contain" draggable={false} />
        ) : (
          <Monitor className="size-3.5 text-green-600" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">{app.name}</div>
        <div className="truncate text-xs text-muted-foreground">{app.path}</div>
      </div>
    </button>
  );
}

// ─── メインダイアログ ───────────────────────────────────────────
export default function AppPickerDialog({ onSelect, onClose }: AppPickerDialogProps) {
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const result = await getElectronAPI()?.getInstalledApps();
      setApps(result ?? []);
      setLoading(false);
    };
    void load();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const filtered = apps.filter((app) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return app.name.toLowerCase().includes(q) || app.path.toLowerCase().includes(q);
  });

  useEffect(() => {
    setSelectedIndex((prev) =>
      filtered.length === 0 ? 0 : Math.min(prev, filtered.length - 1),
    );
  }, [filtered.length]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
        if (filtered[selectedIndex]) onSelect(filtered[selectedIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl max-h-[520px]">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold text-foreground" data-display="true">
            インストール済みアプリから選択
          </h2>
          <button
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={onClose}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* 検索 */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="アプリ名で検索..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* リスト */}
        <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-none">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              アプリを検索中...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              {query ? `"${query}" に一致するアプリはありません` : 'アプリが見つかりません'}
            </div>
          ) : (
            filtered.map((app, index) => (
              <AppRow
                key={`${app.path}-${index}`}
                app={app}
                index={index}
                isSelected={index === selectedIndex}
                onSelect={() => onSelect(app)}
                onHover={() => setSelectedIndex(index)}
              />
            ))
          )}
        </div>

        {/* フッター */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>↑↓ 移動</span>
            <span>← 選択</span>
            <span>Esc 閉じる</span>
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length}件</span>
        </div>
      </div>
    </div>
  );
}
