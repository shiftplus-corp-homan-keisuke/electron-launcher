export type ItemType = 'folder' | 'app' | 'url' | 'snippet';

export interface LauncherItem {
  id: string;
  type: ItemType;
  name: string;
  path: string;
  content?: string;    // スニペット本文 (snippet 以外は undefined)
  createdAt: number;
  pinned: boolean;
  launchCount: number;
  lastLaunchedAt: number;
}

export interface AppSettings {
  hotkey: string;
  launchAtStartup: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface InstalledApp {
  name: string;
  path: string;
}
