# スニペット機能 実装計画

## Goal

らっこらんちゃーに「スニペット」アイテム種別を追加し、ダブルShiftで呼び出したランチャーからテキストスニペットを検索・選択 → クリップボードにコピー → 元アプリへ復帰して自動貼り付けできるようにする。

## 方針

段階的に実装し、各フェーズ単体で動作可能とする。

| フェーズ | 概要 | リスク |
|---------|------|--------|
| Phase 1 | データモデル拡張 + ストア対応 | 低 — 型追加・JSON互換 |
| Phase 2 | 管理画面UIにスニペット追加/編集 | 低 — 既存ItemDialogの拡張 |
| Phase 3 | ランチャー検索・表示にスニペット統合 | 低 — フィルタ追加 |
| Phase 4 | クリップボードコピー (選択で即コピー) | 低 — Electron clipboard API |
| Phase 5 | 元ウィンドウ復帰 + 自動貼り付け (Win32) | **高** — フォーカス制御 |
| Phase 6 | 検証・エッジケース対応 | 中 |

---

## 影響ファイル一覧

### 変更
| ファイル | 変更内容 |
|---------|---------|
| `src/shared/types.ts` | `ItemType` に `'snippet'` 追加、`LauncherItem` に `content?: string` 追加 |
| `src/shared/constants.ts` | IPC チャネル追加 (`PASTE_SNIPPET`) |
| `src/main/store.ts` | `ItemStore.migrate()` で `content` フィールドの既存データ互換 |
| `src/main/index.ts` | スニペット実行 IPC ハンドラ追加、`showLauncher()` で前面 HWND 保存 |
| `src/main/windows.ts` | (Phase 5) 前面HWND保存ヘルパー |
| `src/main/focus-window.ts` | (Phase 5) `saveForegroundWindow()` / `restoreForegroundWindow()` 追加 |
| `src/preload/index.ts` | `pasteSnippet` IPC ブリッジ追加 |
| `src/renderer/lib/ipc.ts` | `ElectronAPI` に `pasteSnippet` 型追加 |
| `src/renderer/components/LauncherView.tsx` | スニペットフィルタ・表示・実行ハンドリング |
| `src/renderer/components/ItemIcon.tsx` | `snippet` 用アイコン追加 |
| `src/renderer/components/ItemDialog.tsx` | `snippet` 種別の入力フォーム (テキストエリア) |
| `src/renderer/components/ManagementView.tsx` | カテゴリに `snippet` 追加 |

### 新規 (Phase 5)
| ファイル | 内容 |
|---------|------|
| `src/main/paste-snippet.ts` | クリップボード設定 → 前面復帰 → SendInput(Ctrl+V) のロジック |

---

## 技術設計メモ

### データモデル

```typescript
// types.ts
export type ItemType = 'folder' | 'app' | 'url' | 'snippet';

export interface LauncherItem {
  id: string;
  type: ItemType;
  name: string;
  path: string;        // snippet の場合は空文字列 ('')
  content?: string;    // snippet 本文 (snippet以外はundefined)
  createdAt: number;
  pinned: boolean;
  launchCount: number;
  lastLaunchedAt: number;
}
```

### フォーカス制御フロー (Phase 5)

```
[ユーザーが別アプリで作業中]
  ↓ ダブルShift
[main] saveForegroundWindow()  ← GetForegroundWindow() で HWND 保存
  ↓
[main] showLauncher()          ← forceFocusWindow() でランチャー前面化
  ↓
[renderer] スニペット選択 → Enter
  ↓
[renderer] IPC: pasteSnippet(content)
  ↓
[main] clipboard.writeText(content)
[main] hideLauncher()
[main] restoreForegroundWindow()  ← SetForegroundWindow(保存HWND)
  ↓ 100ms wait
[main] sendCtrlV()              ← SendInput で Ctrl+V キーストローク
  ↓ (オプション) 500ms wait
[main] clipboard 復元 (元の内容に戻す)
```

### SendInput 実装方針

```typescript
// koffi で user32.dll の SendInput を呼ぶ
// 既存の focus-window.ts と同じパターン
const INPUT_KEYBOARD = 1;
const KEYEVENTF_KEYUP = 0x0002;
const VK_CONTROL = 0x11;
const VK_V = 0x56;

// 4つの INPUT 構造体: Ctrl down → V down → V up → Ctrl up
```

### リスクと緩和策

| リスク | 緩和策 |
|-------|--------|
| 管理者権限アプリへの貼り付け失敗 | フォールバック: コピーのみ + トースト通知 |
| HWND が無効化 (アプリ終了等) | `IsWindow()` チェック → 失敗時コピーのみ |
| blur イベントとの競合 | `snippetPasting` フラグで blur 非表示を抑制 |
| クリップボード上書き | テキストのみ保存・復元 (画像等は諦め) |
| ダブルShift → 表示の間にフォーカス移動 | HWND 保存を `toggleLauncher` の最初に実行 |
