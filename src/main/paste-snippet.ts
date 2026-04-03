/**
 * Windows SendInput を使って Ctrl+V キーストロークを送出する。
 *
 * SendInput は OS レベルの入力イベントを生成するため、
 * フォーカスを持つどのウィンドウにも確実に届く。
 * koffi (native FFI) で user32.dll の SendInput を直接呼ぶ。
 *
 * INPUT 構造体レイアウト (64bit Windows, sizeof = 40 bytes):
 *   [0-3]   type       = INPUT_KEYBOARD = 1
 *   [4-7]   padding    (union の 8 バイトアライン)
 *   [8-9]   wVk        (仮想キーコード)
 *   [10-11] wScan      = 0
 *   [12-15] dwFlags    (0=keydown / KEYEVENTF_KEYUP=0x0002)
 *   [16-19] time       = 0
 *   [20-23] padding    (dwExtraInfo の 8 バイトアライン)
 *   [24-31] dwExtraInfo = 0
 *   [32-39] padding    (MOUSEINPUT サイズに合わせた union 末尾)
 */

const INPUT_KEYBOARD  = 1;
const KEYEVENTF_KEYUP = 0x0002;
const VK_CONTROL      = 0x11;
const VK_V            = 0x56;
const INPUT_SIZE      = 40; // sizeof(INPUT) on 64-bit Windows

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let win32: { sendCtrlV: () => void } | null = null;

if (process.platform === 'win32') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const koffi = require('koffi');
    const user32 = koffi.load('user32.dll');

    // UINT SendInput(UINT nInputs, LPINPUT pInputs, int cbSize)
    const SendInput = user32.func(
      'uint32_t SendInput(uint32_t nInputs, void *pInputs, int cbSize)',
    );

    win32 = {
      sendCtrlV() {
        const buf = Buffer.alloc(INPUT_SIZE * 4, 0);

        const write = (offset: number, vk: number, flags: number) => {
          buf.writeUInt32LE(INPUT_KEYBOARD, offset);      // type
          buf.writeUInt16LE(vk,             offset + 8);  // wVk
          buf.writeUInt16LE(0,              offset + 10); // wScan
          buf.writeUInt32LE(flags,          offset + 12); // dwFlags
          // time=0, dwExtraInfo=0 は alloc 時の 0 埋めのまま
        };

        write(0,              VK_CONTROL, 0);                // Ctrl ↓
        write(INPUT_SIZE * 1, VK_V,       0);                // V   ↓
        write(INPUT_SIZE * 2, VK_V,       KEYEVENTF_KEYUP);  // V   ↑
        write(INPUT_SIZE * 3, VK_CONTROL, KEYEVENTF_KEYUP);  // Ctrl ↑

        const sent = SendInput(4, buf, INPUT_SIZE);
        console.log(`[paste-snippet] SendInput sent ${sent} events`);
      },
    };

    console.log('[paste-snippet] SendInput helper loaded');
  } catch (err) {
    console.warn('[paste-snippet] koffi unavailable, SendInput disabled:', err);
  }
}

/** Ctrl+V キーストロークをアクティブウィンドウに送出する (Windows のみ) */
export function sendCtrlV(): void {
  if (!win32) return;
  try {
    win32.sendCtrlV();
  } catch (err) {
    console.error('[paste-snippet] Failed to send Ctrl+V:', err);
  }
}
