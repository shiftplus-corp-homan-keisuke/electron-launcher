import { useState, useEffect } from 'react';
import { FolderOpen, Monitor, Globe, Plus, Pencil, Trash2, X, Minus, Star, Sun, Moon, MonitorSmartphone } from 'lucide-react';
import type { LauncherItem, ItemType, AppSettings } from '@shared/types';
import { useItemsStore } from '@/stores/items-store';
import { getElectronAPI } from '@/lib/ipc';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ItemIcon, typeLabel } from './ItemIcon';
import ItemDialog from './ItemDialog';

type CategoryFilter = 'all' | ItemType;

const categoryItems: { key: CategoryFilter; label: string; icon: typeof FolderOpen }[] = [
  { key: 'all', label: 'すべて', icon: Globe },
  { key: 'folder', label: 'フォルダ', icon: FolderOpen },
  { key: 'app', label: 'アプリ', icon: Monitor },
  { key: 'url', label: 'URL', icon: Globe },
];

const themeOptions: { value: AppSettings['theme']; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'ライト', icon: Sun },
  { value: 'dark', label: 'ダーク', icon: Moon },
  { value: 'system', label: 'システム', icon: MonitorSmartphone },
];

export default function ManagementView() {
  const { items, initialize, deleteItem, togglePin } = useItemsStore();
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [editingItem, setEditingItem] = useState<LauncherItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<AppSettings['theme']>('system');

  useEffect(() => {
    void initialize();
    // 現在のテーマ設定を取得
    void getElectronAPI()?.getSettings().then((s) => setCurrentTheme(s.theme));
  }, [initialize]);

  const handleThemeChange = async (theme: AppSettings['theme']) => {
    setCurrentTheme(theme);
    await getElectronAPI()?.saveSettings({ theme });
  };

  const filtered = category === 'all' ? items : items.filter((i) => i.type === category);

  const handleClose = async () => {
    await getElectronAPI()?.closeManagement();
  };

  const handleMinimize = async () => {
    await getElectronAPI()?.minimizeWindow();
  };

  const handleAdd = () => {
    setEditingItem(null);
    setDialogMode('add');
  };

  const handleEdit = (item: LauncherItem) => {
    setEditingItem(item);
    setDialogMode('edit');
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteItem(id);
    setDeletingId(null);
  };

  const handleDialogClose = () => {
    setDialogMode(null);
    setEditingItem(null);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
      {/* タイトルバー (ドラッグ可能) */}
      <div className="drag-region flex items-center justify-between border-b border-border px-5 py-3.5">
        <span className="text-sm font-semibold text-foreground" data-display="true">
          アイテム管理
        </span>
        <div className="no-drag flex items-center gap-1">
          <button
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => void handleMinimize()}
            aria-label="最小化"
          >
            <Minus className="size-3" />
          </button>
          <button
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => void handleClose()}
            aria-label="閉じる"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex flex-1 overflow-hidden">
        {/* サイドバー */}
        <aside className="flex w-36 shrink-0 flex-col border-r border-border bg-sidebar p-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            カテゴリ
          </p>
          <div className="flex flex-col gap-0.5">
            {categoryItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
                  category === key
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setCategory(key)}
              >
                <Icon className="size-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </div>

          {/* テーマ切替 */}
          <div className="mt-auto border-t border-border pt-3">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              テーマ
            </p>
            <div className="flex flex-col gap-0.5">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
                    currentTheme === value
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  onClick={() => void handleThemeChange(value)}
                >
                  <Icon className="size-3.5 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* アイテム一覧 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* ヘッダー */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <span className="text-sm font-medium text-foreground">
              {category === 'all' ? 'すべてのアイテム' : `${categoryItems.find((c) => c.key === category)?.label}`}
              <span className="ml-1.5 text-muted-foreground">({filtered.length}件)</span>
            </span>
            <Button size="sm" onClick={handleAdd} className="gap-1.5 text-xs">
              <Plus className="size-3.5" />
              アイテムを追加
            </Button>
          </div>

          {/* リスト */}
          <div className="flex-1 overflow-y-auto scrollbar-none">
            {filtered.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                アイテムがありません
              </div>
            ) : (
              <>
                {/* テーブルヘッダー */}
                <div className="grid grid-cols-[1fr_auto] border-b border-border px-5 py-2">
                  <span className="text-xs font-medium text-muted-foreground">名前</span>
                  <span className="text-xs font-medium text-muted-foreground">操作</span>
                </div>

                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_auto] items-center border-b border-border/60 px-5 py-3 last:border-0 hover:bg-muted/30"
                  >
                    {/* アイテム情報 */}
                    <div className="flex min-w-0 items-center gap-3">
                      <ItemIcon type={item.type} path={item.path} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                          {item.name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {item.path}
                        </div>
                      </div>
                    </div>

                    {/* 操作ボタン */}
                    <div className="flex items-center gap-1">
                      <button
                        className={cn(
                          'flex size-7 items-center justify-center rounded-md transition-colors',
                          item.pinned
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-muted-foreground hover:bg-muted hover:text-amber-500',
                        )}
                        onClick={() => void togglePin(item.id)}
                        aria-label={item.pinned ? 'ピン留め解除' : 'ピン留め'}
                      >
                        <Star className={cn('size-3.5', item.pinned && 'fill-current')} />
                      </button>
                      <button
                        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={() => handleEdit(item)}
                        aria-label="編集"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        className={cn(
                          'flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive',
                          deletingId === item.id && 'opacity-50 pointer-events-none',
                        )}
                        onClick={() => void handleDelete(item.id)}
                        aria-label="削除"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* アイテム追加/編集ダイアログ */}
      {dialogMode !== null && (
        <ItemDialog
          mode={dialogMode}
          item={editingItem}
          defaultType={category !== 'all' ? category : undefined}
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
}
