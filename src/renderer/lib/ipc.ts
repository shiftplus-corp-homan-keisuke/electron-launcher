import type { LauncherItem, AppSettings, InstalledApp } from '@shared/types';

// window.electronAPI の型定義
export interface ElectronAPI {
  // アイテム管理
  getItems(): Promise<LauncherItem[]>;
  addItem(item: Omit<LauncherItem, 'id' | 'createdAt' | 'pinned' | 'launchCount' | 'lastLaunchedAt'>): Promise<void>;
  updateItem(item: LauncherItem): Promise<void>;
  deleteItem(id: string): Promise<void>;
  togglePin(id: string): Promise<void>;
  onItemsChanged(callback: (items: LauncherItem[]) => void): () => void;

  // ランチャー操作
  launchItem(item: LauncherItem): Promise<void>;
  hideLauncher(): Promise<void>;
  onShowLauncher(callback: () => void): () => void;

  // 管理ウィンドウ
  openManagement(): Promise<void>;
  closeManagement(): Promise<void>;

  // ファイルダイアログ
  browseFolder(): Promise<string | null>;
  browseApp(): Promise<string | null>;

  // システム設定
  getAutoLaunch(): Promise<boolean>;
  setAutoLaunch(enabled: boolean): Promise<void>;
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: Partial<AppSettings>): Promise<void>;
  getNativeTheme(): Promise<'light' | 'dark'>;
  onThemeChanged(callback: (theme: 'light' | 'dark') => void): () => void;

  // ウィンドウ操作
  closeWindow(): Promise<void>;
  minimizeWindow(): Promise<void>;

  // アイテム名の自動提案
  getItemMeta(type: string, itemPath: string): Promise<{ name: string }>;

  // インストール済みアプリ一覧
  getInstalledApps(): Promise<InstalledApp[]>;

  // ファイルアイコン取得
  getFileIcon(filePath: string): Promise<string | null>;

  // スニペット貼り付け (Phase 4: クリップボードコピー / Phase 5: 自動貼り付け)
  pasteSnippet(content: string): Promise<void>;
}

export function getElectronAPI(): ElectronAPI | null {
  return (window as typeof window & { electronAPI?: ElectronAPI }).electronAPI ?? null;
}
