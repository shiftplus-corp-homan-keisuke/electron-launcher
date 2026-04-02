import { BrowserWindow, screen, nativeImage } from 'electron';
import path from 'path';
import fs from 'fs';
import { resolveResourcePath } from './resource-paths';
import { forceFocusWindow } from './focus-window';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

function getIconPath(): string | undefined {
  const iconPath = resolveResourcePath('icon.png');
  return fs.existsSync(iconPath) ? iconPath : undefined;
}

function loadURL(win: BrowserWindow, hash = ''): void {
  if (typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== 'undefined') {
    void win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + (hash ? `#${hash}` : ''));
  } else {
    void win.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      hash ? { hash } : undefined,
    );
  }
}

// ─────────────────────────────────────────────────────────────
// ランチャーウィンドウ (コマンドパレット)
// ─────────────────────────────────────────────────────────────
export function createLauncherWindow(): BrowserWindow {
  const iconPath = getIconPath();
  const icon = iconPath ? nativeImage.createFromPath(iconPath) : undefined;

  const win = new BrowserWindow({
    width: 520,
    height: 780,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    transparent: false,
    backgroundColor: '#ffffff',
    ...(icon ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  loadURL(win, 'launcher');

  // 開発時のみ DevTools
  if (typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== 'undefined') {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  return win;
}

// ─────────────────────────────────────────────────────────────
// 管理ウィンドウ
// ─────────────────────────────────────────────────────────────
export function createManagementWindow(): BrowserWindow {
  const iconPath = getIconPath();
  const icon = iconPath ? nativeImage.createFromPath(iconPath) : undefined;

  const win = new BrowserWindow({
    width: 660,
    height: 640,
    frame: false,
    resizable: false,
    skipTaskbar: false,
    show: false,
    backgroundColor: '#ffffff',
    ...(icon ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'アイテム管理 - らっこらんちゃー',
  });

  loadURL(win, 'management');

  return win;
}

// ─────────────────────────────────────────────────────────────
// ランチャーを画面上部中央に配置して表示
// ─────────────────────────────────────────────────────────────
export function showLauncherCentered(win: BrowserWindow): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;
  const { x: workX, y: workY } = primaryDisplay.workArea;

  const winWidth = 520;
  const winHeight = 780;

  const x = workX + Math.round((screenWidth - winWidth) / 2);
  const y = workY + 120;

  win.setPosition(x, y);
  win.show();

  // Win32 API (AttachThreadInput + SetForegroundWindow) で
  // 確実に OS レベルのキーボードフォーカスを奪う。
  // Electron の win.focus() だけでは別アプリからフォーカスを奪えない。
  forceFocusWindow(win);
  win.focus();
}

// ─────────────────────────────────────────────────────────────
// 管理ウィンドウをスクリーン中央に配置して表示
// ─────────────────────────────────────────────────────────────
export function showManagementCentered(win: BrowserWindow): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  const { x: workX, y: workY } = primaryDisplay.workArea;

  const winWidth = 660;
  const winHeight = 640;

  const x = workX + Math.round((screenWidth - winWidth) / 2);
  const y = workY + Math.round((screenHeight - winHeight) / 2);

  win.setPosition(x, y);
  win.show();
  win.focus();
}
