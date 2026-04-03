import { BrowserWindow } from 'electron';

/**
 * Windows で BrowserWindow に OS レベルのキーボードフォーカスを強制的に設定する。
 *
 * Electron の win.focus() は内部で SetForegroundWindow() を呼ぶが、
 * バックグラウンドプロセスからの呼び出しは Windows に無視される。
 * AttachThreadInput でフォアグラウンドスレッドに接続してから
 * SetForegroundWindow を呼ぶことでこの制限を回避する。
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let win32: {
  forceFocus: (hwndBuf: Buffer) => void;
  saveForeground: () => void;
  restoreForeground: () => boolean;
} | null = null;

/** スニペット貼り付け後に復帰するウィンドウの HWND (koffi が返すポインタ値) */
let savedHwnd: unknown = null;

if (process.platform === 'win32') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const koffi = require('koffi');

    const user32 = koffi.load('user32.dll');
    const kernel32 = koffi.load('kernel32.dll');

    const GetForegroundWindow = user32.func('void *GetForegroundWindow()');
    const GetWindowThreadProcessId = user32.func(
      'uint32_t GetWindowThreadProcessId(void *hWnd, _Out_ uint32_t *lpdwProcessId)',
    );
    const GetCurrentThreadId = kernel32.func('uint32_t GetCurrentThreadId()');
    const AttachThreadInput = user32.func(
      'bool AttachThreadInput(uint32_t idAttach, uint32_t idAttachTo, bool fAttach)',
    );
    const SetForegroundWindow = user32.func('bool SetForegroundWindow(void *hWnd)');
    const BringWindowToTop = user32.func('bool BringWindowToTop(void *hWnd)');
    const IsWindow = user32.func('bool IsWindow(void *hWnd)');

    win32 = {
      forceFocus(hwndBuf: Buffer) {
        const hwnd = Number(hwndBuf.readBigInt64LE());

        const fg = GetForegroundWindow();
        const pidOut = [0];
        const fgThread = GetWindowThreadProcessId(fg, pidOut);
        const myThread = GetCurrentThreadId();

        if (fgThread !== myThread) {
          AttachThreadInput(myThread, fgThread, true);
        }

        SetForegroundWindow(hwnd);
        BringWindowToTop(hwnd);

        if (fgThread !== myThread) {
          AttachThreadInput(myThread, fgThread, false);
        }
      },

      saveForeground() {
        savedHwnd = GetForegroundWindow();
        console.log('[focus-window] Saved foreground window');
      },

      restoreForeground() {
        if (savedHwnd === null) return false;
        try {
          // IsWindow: 保存後にウィンドウが閉じられていないか確認
          if (!IsWindow(savedHwnd)) {
            console.warn('[focus-window] Saved window is no longer valid');
            return false;
          }
          SetForegroundWindow(savedHwnd);
          BringWindowToTop(savedHwnd);
          console.log('[focus-window] Restored foreground window');
          return true;
        } finally {
          // 成否に関わらず保存済み HWND をクリア
          savedHwnd = null;
        }
      },
    };

    console.log('[focus-window] Win32 focus helper loaded');
  } catch (err) {
    console.warn('[focus-window] koffi not available, falling back to standard focus:', err);
  }
}

export function forceFocusWindow(win: BrowserWindow): void {
  if (!win32) return;
  try {
    win32.forceFocus(win.getNativeWindowHandle());
  } catch (err) {
    console.error('[focus-window] Failed to force focus:', err);
  }
}

/**
 * 現在の前面ウィンドウ (HWND) を保存する。
 * スニペット起動前 (ランチャー表示時) に呼び出す。
 */
export function saveForegroundWindow(): void {
  if (!win32) return;
  try {
    win32.saveForeground();
  } catch (err) {
    console.error('[focus-window] Failed to save foreground window:', err);
  }
}

/**
 * 保存済みの前面ウィンドウにフォーカスを復帰させる。
 * スニペット確定後 (ランチャー非表示後) に呼び出す。
 * @returns 復帰に成功した場合は true、失敗/スキップ時は false
 */
export function restoreForegroundWindow(): boolean {
  if (!win32) return false;
  try {
    return win32.restoreForeground();
  } catch (err) {
    console.error('[focus-window] Failed to restore foreground window:', err);
    return false;
  }
}
