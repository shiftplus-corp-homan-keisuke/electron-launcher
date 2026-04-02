import type { AppSettings, LauncherItem } from './types';

export const IPC_CHANNELS = {
  // アイテム管理
  GET_ITEMS: 'get-items',
  ADD_ITEM: 'add-item',
  UPDATE_ITEM: 'update-item',
  DELETE_ITEM: 'delete-item',
  TOGGLE_PIN: 'toggle-pin',
  ITEMS_CHANGED: 'items-changed',       // Main → Renderer: アイテム変更通知

  // ランチャー操作
  LAUNCH_ITEM: 'launch-item',
  HIDE_LAUNCHER: 'hide-launcher',
  SHOW_LAUNCHER: 'show-launcher',

  // 管理ウィンドウ
  OPEN_MANAGEMENT: 'open-management',
  CLOSE_MANAGEMENT: 'close-management',

  // ファイルダイアログ
  BROWSE_FOLDER: 'browse-folder',
  BROWSE_APP: 'browse-app',

  // システム設定
  GET_AUTO_LAUNCH: 'get-auto-launch',
  SET_AUTO_LAUNCH: 'set-auto-launch',
  GET_SETTINGS: 'get-settings',
  SAVE_SETTINGS: 'save-settings',
  GET_NATIVE_THEME: 'get-native-theme',
  THEME_CHANGED: 'theme-changed',       // Main → Renderer: テーマ変更通知

  // アイテムメタ情報取得 (名前の自動提案)
  GET_ITEM_META: 'get-item-meta',   // Main: フォルダ名/アプリ名/URLタイトルを返却

  // インストール済みアプリ一覧
  GET_INSTALLED_APPS: 'get-installed-apps',

  // ファイルアイコン取得
  GET_FILE_ICON: 'get-file-icon',

  // ウィンドウ操作
  WINDOW_CLOSE: 'window-close',
  WINDOW_MINIMIZE: 'window-minimize',
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  hotkey: 'Ctrl+Shift+Space',
  launchAtStartup: false,
  theme: 'dark',
};

export const DEFAULT_ITEMS: LauncherItem[] = [
  {
    id: 'default-1',
    type: 'folder',
    name: 'Documents',
    path: 'C:/Users/User/Documents',
    createdAt: Date.now(),
    pinned: false,
    launchCount: 0,
    lastLaunchedAt: 0,
  },
  {
    id: 'default-2',
    type: 'folder',
    name: 'Desktop',
    path: 'C:/Users/User/Desktop',
    createdAt: Date.now(),
    pinned: false,
    launchCount: 0,
    lastLaunchedAt: 0,
  },
];
