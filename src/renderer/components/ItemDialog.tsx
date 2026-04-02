import { useState, useEffect, useRef, useCallback } from 'react';
import { FolderOpen, Monitor, Globe, FolderSearch, Loader2, Wand2, AppWindow } from 'lucide-react';
import type { LauncherItem, ItemType, InstalledApp } from '@shared/types';
import { useItemsStore } from '@/stores/items-store';
import { getElectronAPI } from '@/lib/ipc';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppPickerDialog from './AppPickerDialog';

interface ItemDialogProps {
  mode: 'add' | 'edit';
  item: LauncherItem | null;
  defaultType?: ItemType;
  onClose: () => void;
}

const typeOptions: { value: ItemType; label: string; icon: typeof FolderOpen }[] = [
  { value: 'folder', label: 'フォルダ', icon: FolderOpen },
  { value: 'app',    label: 'アプリ',   icon: Monitor },
  { value: 'url',    label: 'URL',      icon: Globe },
];

export default function ItemDialog({ mode, item, defaultType, onClose }: ItemDialogProps) {
  const { addItem, updateItem } = useItemsStore();

  const [type, setType]           = useState<ItemType>(item?.type ?? defaultType ?? 'folder');
  const [name, setName]           = useState(item?.name ?? '');
  const [itemPath, setItemPath]   = useState(item?.path ?? '');
  const [nameError, setNameError] = useState('');
  const [pathError, setPathError] = useState('');
  const [saving, setSaving]       = useState(false);
  const [loadingName, setLoadingName] = useState(false);
  const [showAppPicker, setShowAppPicker] = useState(false);

  // 名前が「自動入力モード」かどうか (手動編集されたら false に)
  // 編集モードは最初から手動扱い
  const nameAutoRef = useRef(mode === 'add');

  // 編集モードで item が変わったら反映
  useEffect(() => {
    if (item) {
      setType(item.type);
      setName(item.name);
      setItemPath(item.path);
    }
  }, [item]);

  // ─────────────────────────────────────────────────────────────
  // 名前の自動取得
  // ─────────────────────────────────────────────────────────────
  const fetchName = useCallback(async (t: ItemType, p: string) => {
    if (!p.trim() || !nameAutoRef.current) return;
    setLoadingName(true);
    try {
      const meta = await getElectronAPI()?.getItemMeta(t, p);
      // 自動モードがまだ有効なら名前を上書き
      if (meta?.name && nameAutoRef.current) {
        setName(meta.name);
        setNameError('');
      }
    } finally {
      setLoadingName(false);
    }
  }, []);

  // URL: 入力後 1 秒のデバウンスで自動取得
  useEffect(() => {
    if (type !== 'url') return;
    if (!itemPath.startsWith('http://') && !itemPath.startsWith('https://')) return;

    const timer = setTimeout(() => void fetchName(type, itemPath), 1000);
    return () => clearTimeout(timer);
  }, [type, itemPath, fetchName]);

  // ─────────────────────────────────────────────────────────────
  // 種類変更: パス・名前をリセット
  // ─────────────────────────────────────────────────────────────
  const handleTypeChange = (newType: ItemType) => {
    setType(newType);
    setItemPath('');
    setName('');
    setPathError('');
    setNameError('');
    nameAutoRef.current = true; // 自動モードに戻す
  };

  // ─────────────────────────────────────────────────────────────
  // ファイル参照ダイアログ → パス確定後に名前を自動取得
  // ─────────────────────────────────────────────────────────────
  const handleBrowse = async () => {
    const api = getElectronAPI();
    if (!api) return;

    const result = type === 'folder'
      ? await api.browseFolder()
      : await api.browseApp();

    if (!result) return;
    setItemPath(result);
    setPathError('');
    // 参照直後は自動モードで名前取得
    nameAutoRef.current = true;
    await fetchName(type, result);
  };

  // ─────────────────────────────────────────────────────────────
  // インストール済みアプリ一覧から選択
  // ─────────────────────────────────────────────────────────────
  const handleAppPicked = (app: InstalledApp) => {
    setItemPath(app.path);
    setName(app.name);
    setPathError('');
    setNameError('');
    nameAutoRef.current = false; // ユーザーが明示的に選んだので手動扱い
    setShowAppPicker(false);
  };

  // ─────────────────────────────────────────────────────────────
  // バリデーション
  // ─────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    let valid = true;
    setNameError('');
    setPathError('');

    if (!name.trim()) {
      setNameError('名前を入力してください');
      valid = false;
    }
    if (!itemPath.trim()) {
      setPathError(type === 'url' ? 'URLを入力してください' : 'パスを入力してください');
      valid = false;
    }
    if (type === 'url' && itemPath.trim() && !/^https?:\/\//.test(itemPath.trim())) {
      setPathError('URLは http:// または https:// で始めてください');
      valid = false;
    }
    return valid;
  };

  // ─────────────────────────────────────────────────────────────
  // 保存
  // ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { type, name: name.trim(), path: itemPath.trim() };
      if (mode === 'add') {
        await addItem(payload);
      } else if (item) {
        await updateItem({ ...item, ...payload });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-xl">
        {/* タイトル */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground" data-display="true">
            {mode === 'add' ? 'アイテムを追加' : 'アイテムを編集'}
          </h2>
          <button
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={onClose}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* 種類選択 */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">種類を選択</Label>
            <div className="flex gap-2">
              {typeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-md border py-2 text-sm transition-colors',
                    type === value
                      ? 'border-primary bg-accent text-primary font-medium'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted',
                  )}
                  onClick={() => handleTypeChange(value)}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* パス / URL ─ 名前より先に配置して先に入力させる */}
          <div className="space-y-1.5">
            <Label htmlFor="item-path" className="text-xs text-muted-foreground">
              {type === 'url' ? 'URL' : 'パス'}
            </Label>
            <div className="flex gap-2">
              <Input
                id="item-path"
                placeholder={
                  type === 'url'
                    ? '例: https://example.com'
                    : '例: C:/Users/... または 参照ボタンで選択'
                }
                value={itemPath}
                onChange={(e) => {
                  setItemPath(e.target.value);
                  if (pathError) setPathError('');
                  // URL 手動入力中は自動モードを維持
                  if (type === 'url') nameAutoRef.current = true;
                }}
                className={cn(
                  'flex-1',
                  pathError && 'border-destructive focus-visible:ring-destructive/30',
                )}
              />
              {type !== 'url' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5 text-xs"
                  onClick={() => void handleBrowse()}
                >
                  <FolderSearch className="size-3.5" />
                  参照...
                </Button>
              )}
            </div>
            {type === 'app' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-xs"
                onClick={() => setShowAppPicker(true)}
              >
                <AppWindow className="size-3.5" />
                インストール済みアプリから選択...
              </Button>
            )}
            {pathError && <p className="text-xs text-destructive">{pathError}</p>}
          </div>

          {/* 名前 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="item-name" className="text-xs text-muted-foreground">名前</Label>
              {/* ローディング or 再取得ボタン */}
              {loadingName ? (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  取得中...
                </span>
              ) : itemPath.trim() ? (
                <button
                  type="button"
                  className="flex items-center gap-1 rounded text-xs text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => {
                    nameAutoRef.current = true;
                    void fetchName(type, itemPath);
                  }}
                  title="名前を自動取得しなおす"
                >
                  <Wand2 className="size-3" />
                  自動取得
                </button>
              ) : null}
            </div>
            <Input
              id="item-name"
              placeholder={
                type === 'folder' ? '例: Documents' :
                type === 'app'    ? '例: Visual Studio Code' :
                                    '例: GitHub'
              }
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                nameAutoRef.current = false; // 手動編集で自動モードをオフ
                if (nameError) setNameError('');
              }}
              className={cn(nameError && 'border-destructive focus-visible:ring-destructive/30')}
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>
        </div>

        {/* フッターボタン */}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            キャンセル
          </Button>
          <Button size="sm" onClick={() => void handleSave()} disabled={saving || loadingName}>
            {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      {/* アプリ選択ダイアログ */}
      {showAppPicker && (
        <AppPickerDialog
          onSelect={handleAppPicked}
          onClose={() => setShowAppPicker(false)}
        />
      )}
    </div>
  );
}
