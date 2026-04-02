import {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  shell,
  dialog,
  nativeTheme,
  net,
} from 'electron';
import nodePath from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { updateElectronApp } from 'update-electron-app';
import { IPC_CHANNELS } from '../shared/constants';
import type { LauncherItem, InstalledApp } from '../shared/types';
import { autoLaunch } from './auto-launch';
import { TrayManager } from './tray';
import { itemStore, settingsStore } from './store';
import { registerDoubleShiftHotkey, unregisterHotkey } from './hotkey';
import {
  createLauncherWindow,
  createManagementWindow,
  showLauncherCentered,
  showManagementCentered,
} from './windows';

// ─────────────────────────────────────────────────────────────
// stdout/stderr エラーハンドリング
// ─────────────────────────────────────────────────────────────
for (const stream of [process.stdout, process.stderr]) {
  stream?.on?.('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EIO' || err.code === 'EPIPE') return;
    throw err;
  });
}

// ─────────────────────────────────────────────────────────────
// Windows AppUserModelId (通知・タスクバー用)
// ─────────────────────────────────────────────────────────────
if (process.platform === 'win32') {
  app.setAppUserModelId('com.rakko-launcher.app');
}

if (process.platform === 'linux') {
  app.disableHardwareAcceleration();
}

updateElectronApp();

// ─────────────────────────────────────────────────────────────
// 多重起動防止
// ─────────────────────────────────────────────────────────────
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (launcherWindow && !launcherWindow.isVisible()) {
      showLauncherCentered(launcherWindow);
    }
  });
}

let launcherWindow: BrowserWindow | null = null;
let managementWindow: BrowserWindow | null = null;
let trayManager: TrayManager | null = null;
let trayAvailable = false;
let isQuitting = false;

// 管理ウィンドウが開いている間はランチャーのblurで隠さないためのフラグ
let managementOpening = false;

// showLauncher 直後の blur で即隠れるのを防ぐためのタイムスタンプ
let lastShowTime = 0;
const SHOW_BLUR_GUARD_MS = 300;

// ─────────────────────────────────────────────────────────────
// テーマ適用
// ─────────────────────────────────────────────────────────────
function applyTheme(): void {
  const { theme } = settingsStore.get();
  nativeTheme.themeSource = theme;
  // nativeTheme.on('updated') が発火しない場合に備えて直接ブロードキャスト
  broadcastThemeChanged();
}

function broadcastThemeChanged(): void {
  const resolved = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  launcherWindow?.webContents.send(IPC_CHANNELS.THEME_CHANGED, resolved);
  managementWindow?.webContents.send(IPC_CHANNELS.THEME_CHANGED, resolved);
}

// ─────────────────────────────────────────────────────────────
// ランチャー表示/非表示
// ─────────────────────────────────────────────────────────────
function showLauncher(): void {
  if (!launcherWindow) return;
  lastShowTime = Date.now();
  showLauncherCentered(launcherWindow);
  // レンダラーに表示通知 (検索欄リセット用)
  launcherWindow.webContents.send(IPC_CHANNELS.SHOW_LAUNCHER);
}

function hideLauncher(): void {
  launcherWindow?.hide();
}

function toggleLauncher(): void {
  if (!launcherWindow) return;
  const visible = launcherWindow.isVisible();
  console.log(`[launcher] toggleLauncher called — isVisible=${visible}`);
  if (visible) {
    hideLauncher();
  } else {
    showLauncher();
  }
}

// ─────────────────────────────────────────────────────────────
// 管理ウィンドウ表示/非表示
// ─────────────────────────────────────────────────────────────
function openManagement(): void {
  if (!managementWindow) return;
  managementOpening = true;
  hideLauncher();
  showManagementCentered(managementWindow);
  // アイテムの最新状態を送信
  managementWindow.webContents.send(IPC_CHANNELS.ITEMS_CHANGED, itemStore.getAll());
  setTimeout(() => {
    managementOpening = false;
  }, 300);
}

function closeManagement(): void {
  managementWindow?.hide();
}

// ─────────────────────────────────────────────────────────────
// 全ウィンドウにアイテム変更を通知
// ─────────────────────────────────────────────────────────────
function broadcastItemsChanged(): void {
  const items = itemStore.getAll();
  launcherWindow?.webContents.send(IPC_CHANNELS.ITEMS_CHANGED, items);
  if (managementWindow?.isVisible()) {
    managementWindow.webContents.send(IPC_CHANNELS.ITEMS_CHANGED, items);
  }
}

// ─────────────────────────────────────────────────────────────
// ウィンドウ作成
// ─────────────────────────────────────────────────────────────
function createWindows(): void {
  // ── ランチャーウィンドウ ──
  launcherWindow = createLauncherWindow();

  // フォーカスを失ったら自動的に隠す。
  // show 直後の blur や管理ウィンドウ遷移中は無視する。
  launcherWindow.on('blur', () => {
    if (managementOpening) return;
    // 表示直後の blur は無視 (フォーカス遷移の過渡状態で発生しうる)
    if (Date.now() - lastShowTime < SHOW_BLUR_GUARD_MS) return;
    setTimeout(() => {
      if (launcherWindow?.isVisible() && !launcherWindow.isFocused()) {
        hideLauncher();
      }
    }, 100);
  });

  launcherWindow.on('close', (e) => {
    if (isQuitting) return;
    e.preventDefault();
    hideLauncher();
  });

  // ── 管理ウィンドウ ──
  managementWindow = createManagementWindow();

  managementWindow.on('close', (e) => {
    if (isQuitting) return;
    e.preventDefault();
    closeManagement();
  });
}

// ─────────────────────────────────────────────────────────────
// トレイ初期化
// ─────────────────────────────────────────────────────────────
function initTray(): void {
  trayManager = new TrayManager(
    showLauncher,
    toggleLauncher,
    openManagement,
    quit,
    () => {
      const current = autoLaunch.isEnabled();
      autoLaunch.set(!current);
      trayManager?.updateAutoLaunchMenuItem(!current);
    },
  );

  trayAvailable = trayManager.init();
  if (trayAvailable) {
    trayManager.buildContextMenu(autoLaunch.isEnabled());
  }
}

// ─────────────────────────────────────────────────────────────
// ダブルShiftホットキー登録
// ─────────────────────────────────────────────────────────────
function registerHotkey(): void {
  registerDoubleShiftHotkey(() => {
    toggleLauncher();
  });
}

// ─────────────────────────────────────────────────────────────
// アイテム名の自動提案ヘルパー
// ─────────────────────────────────────────────────────────────

/** フォルダ・アプリのパスからベース名を取得 */
function getNameFromPath(type: 'folder' | 'app', filePath: string): string {
  const base = nodePath.basename(filePath);
  if (type === 'folder') return base || filePath;
  // app: 拡張子を取り除く (.exe / .lnk / .bat 等)
  return nodePath.basename(filePath, nodePath.extname(filePath));
}

/** URLのHTMLページタイトルを取得 (最大5秒でタイムアウト) */
async function fetchUrlTitle(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    const response = await net.fetch(url, {
      method: 'GET',
      signal: controller.signal as AbortSignal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ja,en;q=0.9',
      },
    });

    clearTimeout(timer);
    if (!response.ok) return null;

    const html = await response.text();

    // <title> タグを抽出
    const match = html.match(/<title[^>]*>([^<]{1,300})<\/title>/i);
    if (!match?.[1]) return null;

    // 基本的なHTMLエンティティをデコード
    return match[1]
      .trim()
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// インストール済みアプリ一覧 (スタートメニュー .lnk スキャン)
// ─────────────────────────────────────────────────────────────

/** 除外パターン: アンインストーラーやヘルプ系 */
const EXCLUDED_NAME_PATTERNS = /uninstall|アンインストール|readme|help|license|changelog/i;

/** ディレクトリを再帰スキャンして .lnk ファイルを収集 */
function collectLnkFiles(dir: string, results: string[] = []): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = nodePath.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectLnkFiles(fullPath, results);
    } else if (entry.name.toLowerCase().endsWith('.lnk')) {
      results.push(fullPath);
    }
  }
  return results;
}

/** スタートメニューからインストール済みアプリ一覧を取得 */
function scanInstalledApps(): InstalledApp[] {
  if (process.platform !== 'win32') return [];

  const startMenuDirs = [
    nodePath.join(process.env.PROGRAMDATA || 'C:\\ProgramData', 'Microsoft\\Windows\\Start Menu\\Programs'),
    nodePath.join(process.env.APPDATA || '', 'Microsoft\\Windows\\Start Menu\\Programs'),
  ];

  const seen = new Map<string, InstalledApp>();

  for (const dir of startMenuDirs) {
    for (const lnkPath of collectLnkFiles(dir)) {
      try {
        const displayName = nodePath.basename(lnkPath, '.lnk');
        if (EXCLUDED_NAME_PATTERNS.test(displayName)) continue;

        const shortcut = shell.readShortcutLink(lnkPath);
        if (!shortcut.target) continue;

        // .exe 以外のターゲット (e.g. .cmd, .bat) も許容
        const targetLower = shortcut.target.toLowerCase();
        if (EXCLUDED_NAME_PATTERNS.test(targetLower)) continue;

        // 重複排除 (同じ exe は先に見つかった方を優先)
        const key = targetLower;
        if (!seen.has(key)) {
          seen.set(key, { name: displayName, path: shortcut.target });
        }
      } catch {
        // 壊れたショートカット等を無視
      }
    }
  }

  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name, 'ja'));
}

// ─────────────────────────────────────────────────────────────
// Win32 アイコン抽出 (ExtractAssociatedIcon 経由)
// Electron の app.getFileIcon() では取得できないアイコンにも対応
// ─────────────────────────────────────────────────────────────
const execFileAsync = promisify(execFile);

async function extractIconWin32(filePath: string): Promise<string | null> {
  if (process.platform !== 'win32') return null;
  try {
    const escaped = filePath.replace(/'/g, "''");
    const script = [
      'Add-Type -AssemblyName System.Drawing',
      `$i=[System.Drawing.Icon]::ExtractAssociatedIcon('${escaped}')`,
      'if($i){$b=$i.ToBitmap();$m=New-Object System.IO.MemoryStream;$b.Save($m,[System.Drawing.Imaging.ImageFormat]::Png);[Convert]::ToBase64String($m.ToArray())}',
    ].join(';');

    const { stdout } = await execFileAsync(
      'powershell',
      ['-NoProfile', '-NonInteractive', '-Command', script],
      { timeout: 5000, windowsHide: true },
    );

    const base64 = stdout.trim();
    if (base64) return `data:image/png;base64,${base64}`;
    return null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// IPC ハンドラー登録
// ─────────────────────────────────────────────────────────────
function registerIpcHandlers(): void {
  // アイテム取得
  ipcMain.handle(IPC_CHANNELS.GET_ITEMS, () => itemStore.getAll());

  // アイテム追加
  ipcMain.handle(IPC_CHANNELS.ADD_ITEM, (_event, item: Omit<LauncherItem, 'id' | 'createdAt' | 'pinned' | 'launchCount' | 'lastLaunchedAt'>) => {
    itemStore.add(item);
    broadcastItemsChanged();
  });

  // アイテム更新
  ipcMain.handle(IPC_CHANNELS.UPDATE_ITEM, (_event, item: LauncherItem) => {
    itemStore.update(item);
    broadcastItemsChanged();
  });

  // アイテム削除
  ipcMain.handle(IPC_CHANNELS.DELETE_ITEM, (_event, id: string) => {
    itemStore.delete(id);
    broadcastItemsChanged();
  });

  // ピン留めトグル
  ipcMain.handle(IPC_CHANNELS.TOGGLE_PIN, (_event, id: string) => {
    itemStore.togglePin(id);
    broadcastItemsChanged();
  });

  // アイテム起動 (起動後にランチャーを隠す)
  ipcMain.handle(IPC_CHANNELS.LAUNCH_ITEM, async (_event, item: LauncherItem) => {
    try {
      if (item.type === 'url') {
        await shell.openExternal(item.path);
      } else {
        const result = await shell.openPath(item.path);
        if (result) {
          console.error('Failed to open path:', result);
        }
      }
      // 起動回数を記録
      itemStore.recordLaunch(item.id);
      broadcastItemsChanged();
    } catch (err) {
      console.error('Failed to launch item:', err);
    }
    hideLauncher();
  });

  // ランチャーを隠す
  ipcMain.handle(IPC_CHANNELS.HIDE_LAUNCHER, () => {
    hideLauncher();
  });

  // 管理ウィンドウを開く
  ipcMain.handle(IPC_CHANNELS.OPEN_MANAGEMENT, () => {
    openManagement();
  });

  // 管理ウィンドウを閉じる
  ipcMain.handle(IPC_CHANNELS.CLOSE_MANAGEMENT, () => {
    closeManagement();
  });

  // フォルダ参照ダイアログ
  ipcMain.handle(IPC_CHANNELS.BROWSE_FOLDER, async () => {
    const parent = managementWindow?.isVisible() ? managementWindow : launcherWindow;
    const result = await dialog.showOpenDialog(parent!, {
      properties: ['openDirectory'],
      title: 'フォルダを選択',
    });
    return result.canceled ? null : result.filePaths[0];
  });

  // アプリ参照ダイアログ
  ipcMain.handle(IPC_CHANNELS.BROWSE_APP, async () => {
    const parent = managementWindow?.isVisible() ? managementWindow : launcherWindow;
    const result = await dialog.showOpenDialog(parent!, {
      properties: ['openFile'],
      title: 'アプリを選択',
      filters: [
        { name: 'Executables', extensions: ['exe', 'lnk', 'bat', 'cmd'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  // スタートアップ設定
  ipcMain.handle(IPC_CHANNELS.GET_AUTO_LAUNCH, () => autoLaunch.isEnabled());
  ipcMain.handle(IPC_CHANNELS.SET_AUTO_LAUNCH, (_event, enabled: boolean) => {
    autoLaunch.set(enabled);
    trayManager?.updateAutoLaunchMenuItem(enabled);
  });

  // アプリ設定
  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, () => settingsStore.get());
  ipcMain.handle(IPC_CHANNELS.SAVE_SETTINGS, (_event, settings) => {
    settingsStore.set(settings);
    applyTheme();
  });

  // テーマ
  ipcMain.handle(IPC_CHANNELS.GET_NATIVE_THEME, () =>
    nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  );

  nativeTheme.on('updated', () => {
    broadcastThemeChanged();
  });

  // ウィンドウ操作
  ipcMain.handle(IPC_CHANNELS.WINDOW_CLOSE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.close();
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.minimize();
  });

  // ─── アイテム名の自動提案 ─────────────────────────────────────
  // フォルダ: basename / アプリ: 拡張子なしbasename(.lnk→リンク先) / URL: HTMLタイトル
  ipcMain.handle(
    IPC_CHANNELS.GET_ITEM_META,
    async (_event, type: string, itemPath: string): Promise<{ name: string }> => {
      if (type === 'folder') {
        return { name: getNameFromPath('folder', itemPath) };
      }

      if (type === 'app') {
        return { name: getNameFromPath('app', itemPath) };
      }

      // url
      try {
        const title = await fetchUrlTitle(itemPath);
        if (title) return { name: title };
        // フォールバック: ホスト名
        return { name: new URL(itemPath).hostname };
      } catch {
        return { name: itemPath };
      }
    },
  );

  // ─── インストール済みアプリ一覧 ─────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.GET_INSTALLED_APPS, () => scanInstalledApps());

  // ─── ファイルアイコン取得 ──────────────────────────────────────
  // Win32 ExtractAssociatedIcon を優先 (Electron API より互換性が高い)
  // 失敗時のみ Electron の app.getFileIcon にフォールバック
  ipcMain.handle(IPC_CHANNELS.GET_FILE_ICON, async (_event, filePath: string): Promise<string | null> => {
    const win32 = await extractIconWin32(filePath);
    if (win32) return win32;

    try {
      const icon = await app.getFileIcon(filePath, { size: 'large' });
      return icon.toDataURL();
    } catch {
      return null;
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 終了処理
// ─────────────────────────────────────────────────────────────
function quit(): void {
  isQuitting = true;
  globalShortcut.unregisterAll();
  unregisterHotkey(); // uiohook 停止
  launcherWindow?.removeAllListeners('close');
  managementWindow?.removeAllListeners('close');
  launcherWindow?.close();
  managementWindow?.close();
  trayManager?.destroy();
  app.quit();
}

// ─────────────────────────────────────────────────────────────
// アプリ起動
// ─────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  applyTheme();
  registerIpcHandlers();
  createWindows();
  initTray();
  registerHotkey();
});

// ウィンドウが全て閉じてもアプリを終了しない (トレイ常駐)
app.on('window-all-closed', () => {
  // intentionally empty
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});
