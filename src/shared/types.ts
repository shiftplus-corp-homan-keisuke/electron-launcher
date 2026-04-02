export type ItemType = 'folder' | 'app' | 'url';

export interface LauncherItem {
  id: string;
  type: ItemType;
  name: string;
  path: string;
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
