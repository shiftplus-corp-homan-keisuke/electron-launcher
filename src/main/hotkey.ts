// ダブルShiftの検知ウィンドウ (ms)
const DOUBLE_PRESS_INTERVAL = 400;

// この秒数以上押しっぱなしのキーは「取りこぼし」とみなして除去
const STALE_KEY_THRESHOLD = 5_000;

const LEFT_SHIFT_KEYCODE = 42;
const RIGHT_SHIFT_KEYCODE = 54;

type UiohookKeyboardEvent = {
  keycode: number;
};

type UiohookModule = {
  on(event: 'keydown' | 'keyup', listener: (event: UiohookKeyboardEvent) => void): void;
  start(): void;
  stop(): void;
};

type ShiftSide = 'left' | 'right';

const shiftState: Record<ShiftSide, { isDown: boolean; isDirty: boolean }> = {
  left: { isDown: false, isDirty: false },
  right: { isDown: false, isDirty: false },
};

// keycode → keydown 時刻。keyup が来なかった古いエントリを自動除去できるよう Map で管理
const nonShiftKeysDown = new Map<number, number>();

let lastShiftTapTime = 0;
let running = false;
let uiohook: UiohookModule | null | undefined;

function getUiohook(): UiohookModule | null {
  if (uiohook !== undefined) {
    return uiohook;
  }

  try {
    const mod = require('uiohook-napi') as { uIOhook?: UiohookModule };
    uiohook = mod.uIOhook ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[hotkey] uiohook unavailable; hotkey disabled (${message})`);
    uiohook = null;
  }

  return uiohook;
}

function getShiftSide(keycode: number): ShiftSide | null {
  if (keycode === LEFT_SHIFT_KEYCODE) return 'left';
  if (keycode === RIGHT_SHIFT_KEYCODE) return 'right';
  return null;
}

function isAnyShiftDown(): boolean {
  return shiftState.left.isDown || shiftState.right.isDown;
}

function markActiveShiftsDirty(): void {
  if (shiftState.left.isDown) shiftState.left.isDirty = true;
  if (shiftState.right.isDown) shiftState.right.isDirty = true;
}

/** STALE_KEY_THRESHOLD 以上押しっぱなしのキーを除去 */
function purgeStaleKeys(): void {
  const now = Date.now();
  for (const [keycode, downTime] of nonShiftKeysDown) {
    if (now - downTime > STALE_KEY_THRESHOLD) {
      nonShiftKeysDown.delete(keycode);
    }
  }
}

/** ダブルShift発火後に全内部状態をリセット */
function resetState(): void {
  lastShiftTapTime = 0;
  nonShiftKeysDown.clear();
  shiftState.left.isDown = false;
  shiftState.left.isDirty = false;
  shiftState.right.isDown = false;
  shiftState.right.isDirty = false;
}

/**
 * ダブルShiftを検知してコールバックを呼ぶ
 * Shift キーが 400ms 以内に2回押されたらトリガー
 */
export function registerDoubleShiftHotkey(onDoubleShift: () => void): void {
  if (running) return;

  const hook = getUiohook();
  if (!hook) return;

  hook.on('keydown', (e) => {
    const shiftSide = getShiftSide(e.keycode);

    if (shiftSide) {
      const currentShift = shiftState[shiftSide];

      if (currentShift.isDown) {
        return;
      }

      const otherShift = shiftState[shiftSide === 'left' ? 'right' : 'left'];

      // Shift keydown 時に古いキーを掃除してから dirty 判定
      purgeStaleKeys();

      currentShift.isDown = true;
      currentShift.isDirty = nonShiftKeysDown.size > 0 || otherShift.isDown;

      if (otherShift.isDown) {
        otherShift.isDirty = true;
      }

      return;
    }

    nonShiftKeysDown.set(e.keycode, Date.now());

    if (isAnyShiftDown()) {
      markActiveShiftsDirty();
    }
  });

  hook.on('keyup', (e) => {
    const shiftSide = getShiftSide(e.keycode);

    if (!shiftSide) {
      nonShiftKeysDown.delete(e.keycode);
      return;
    }

    const currentShift = shiftState[shiftSide];

    if (!currentShift.isDown) {
      return;
    }

    const isCleanTap = !currentShift.isDirty;

    currentShift.isDown = false;
    currentShift.isDirty = false;

    if (!isCleanTap) {
      return;
    }

    const now = Date.now();
    const elapsed = now - lastShiftTapTime;

    if (elapsed < DOUBLE_PRESS_INTERVAL && lastShiftTapTime > 0) {
      // ダブルShift検知 — 全状態をリセットしてからコールバック
      resetState();
      onDoubleShift();
    } else {
      lastShiftTapTime = now;
    }
  });

  try {
    hook.start();
    running = true;
    console.log('[hotkey] Double-Shift listener started');
  } catch (err) {
    console.error('[hotkey] Failed to start uIOhook:', err);
  }
}

export function unregisterHotkey(): void {
  if (!running) return;

  const hook = getUiohook();
  if (!hook) return;

  try {
    hook.stop();
    running = false;
    console.log('[hotkey] Double-Shift listener stopped');
  } catch (err) {
    console.error('[hotkey] Failed to stop uIOhook:', err);
  }
}
