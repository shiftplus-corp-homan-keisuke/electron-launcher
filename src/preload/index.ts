import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import type { LauncherItem, AppSettings, InstalledApp } from '../shared/types';

contextBridge.exposeInMainWorld('electronAPI', {
  // ─── アイテム管理 ────────────────────────────────────────────
  getItems: (): Promise<LauncherItem[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_ITEMS),

  addItem: (item: Omit<LauncherItem, 'id' | 'createdAt' | 'pinned' | 'launchCount' | 'lastLaunchedAt'>): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.ADD_ITEM, item),

  updateItem: (item: LauncherItem): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_ITEM, item),

  deleteItem: (id: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_ITEM, id),

  togglePin: (id: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.TOGGLE_PIN, id),

  onItemsChanged: (callback: (items: LauncherItem[]) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, items: LauncherItem[]) =>
      callback(items);
    ipcRenderer.on(IPC_CHANNELS.ITEMS_CHANGED, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.ITEMS_CHANGED, listener);
  },

  // ─── ランチャー操作 ───────────────────────────────────────────
  launchItem: (item: LauncherItem): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.LAUNCH_ITEM, item),

  hideLauncher: (): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.HIDE_LAUNCHER),

  onShowLauncher: (callback: () => void): (() => void) => {
    const listener = () => callback();
    ipcRenderer.on(IPC_CHANNELS.SHOW_LAUNCHER, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.SHOW_LAUNCHER, listener);
  },

  // ─── 管理ウィンドウ ───────────────────────────────────────────
  openManagement: (): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.OPEN_MANAGEMENT),

  closeManagement: (): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.CLOSE_MANAGEMENT),

  // ─── ファイルダイアログ ───────────────────────────────────────
  browseFolder: (): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.BROWSE_FOLDER),

  browseApp: (): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.BROWSE_APP),

  // ─── システム設定 ─────────────────────────────────────────────
  getAutoLaunch: (): Promise<boolean> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_AUTO_LAUNCH),

  setAutoLaunch: (enabled: boolean): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_AUTO_LAUNCH, enabled),

  getSettings: (): Promise<AppSettings> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS),

  saveSettings: (settings: Partial<AppSettings>): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.SAVE_SETTINGS, settings),

  getNativeTheme: (): Promise<'light' | 'dark'> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_NATIVE_THEME),

  onThemeChanged: (callback: (theme: 'light' | 'dark') => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, theme: 'light' | 'dark') =>
      callback(theme);
    ipcRenderer.on(IPC_CHANNELS.THEME_CHANGED, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.THEME_CHANGED, listener);
  },

  // ─── ウィンドウ操作 ───────────────────────────────────────────
  closeWindow: (): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE),

  minimizeWindow: (): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE),

  // ─── アイテム名の自動提案 ─────────────────────────────────────
  getItemMeta: (type: string, itemPath: string): Promise<{ name: string }> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_ITEM_META, type, itemPath),

  // ─── インストール済みアプリ一覧 ─────────────────────────────────
  getInstalledApps: (): Promise<InstalledApp[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_INSTALLED_APPS),

  // ─── ファイルアイコン取得 ──────────────────────────────────────
  getFileIcon: (filePath: string): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_FILE_ICON, filePath),

  // ─── スニペット貼り付け ────────────────────────────────────────
  pasteSnippet: (content: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.PASTE_SNIPPET, content),
});
