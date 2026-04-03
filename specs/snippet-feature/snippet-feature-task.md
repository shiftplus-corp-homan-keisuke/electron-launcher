# スニペット機能 タスクリスト

## Phase 1: データモデル拡張 + ストア対応
- [x] 1-1: `src/shared/types.ts` — `ItemType` に `'snippet'` を追加
- [x] 1-2: `src/shared/types.ts` — `LauncherItem` に `content?: string` フィールド追加
- [x] 1-3: `src/shared/constants.ts` — `IPC_CHANNELS` に `PASTE_SNIPPET: 'paste-snippet'` 追加
- [x] 1-4: `src/main/store.ts` — `ItemStore.migrate()` で `content` 未定義の既存データに互換対応
- [x] 1-5: `tsc --noEmit` で型エラーなしを確認

## Phase 2: 管理画面 UI
- [x] 2-1: `src/renderer/components/ItemIcon.tsx` — `snippet` 用アイコン (`FileText`) 追加、`typeLabel` に `スニペット` 追加
- [x] 2-2: `src/renderer/components/ItemDialog.tsx` — 種類選択に `snippet` ボタン追加
- [x] 2-3: `src/renderer/components/ItemDialog.tsx` — `type === 'snippet'` 時にパス入力を非表示、代わりにテキストエリア (`content`) を表示
- [x] 2-4: `src/renderer/components/ItemDialog.tsx` — バリデーション: snippet は `content` 必須、`path` は空文字で保存
- [x] 2-5: `src/renderer/components/ManagementView.tsx` — カテゴリフィルタに `{ key: 'snippet', label: 'スニペット', icon }` 追加
- [x] 2-6: `src/renderer/components/ManagementView.tsx` — アイテム一覧でスニペットの `content` プレビュー表示 (先頭60文字)
- [x] 2-7: 管理画面でスニペットの追加・編集・削除が動作することを確認 (コードレビュー済)

## Phase 3: ランチャー検索・表示
- [x] 3-1: `src/renderer/components/LauncherView.tsx` — `FILTERS` に `{ key: 'snippet', label: 'スニペット', icon }` 追加
- [x] 3-2: `src/renderer/components/LauncherView.tsx` — スニペットアイテムの表示: `item.path` の代わりに `item.content` の先頭部分を表示
- [x] 3-3: `src/renderer/components/LauncherView.tsx` — 検索で `item.content` もマッチ対象に追加
- [x] 3-4: ランチャーでスニペットが検索・表示されることを確認 (コードレビュー済)

## Phase 4: クリップボードコピー (最小実装)
- [x] 4-1: `src/main/index.ts` — `PASTE_SNIPPET` IPC ハンドラ追加 (clipboard.writeText のみ → Phase 5 で拡張)
- [x] 4-2: `src/preload/index.ts` — `pasteSnippet(content: string)` ブリッジ追加
- [x] 4-3: `src/renderer/lib/ipc.ts` — `ElectronAPI` に `pasteSnippet` 型定義追加
- [x] 4-4: `src/renderer/components/LauncherView.tsx` — Enter 時の分岐: `type === 'snippet'` なら `pasteSnippet(item.content)` → `hideLauncher()`
- [x] 4-5: ランチャーでスニペット選択 → クリップボードにコピーされることを確認 (コードレビュー済)

## Phase 5: 元ウィンドウ復帰 + 自動貼り付け (Win32)
- [x] 5-1: `src/main/focus-window.ts` — `saveForegroundWindow()` 追加: `GetForegroundWindow()` の戻り値を保持
- [x] 5-2: `src/main/focus-window.ts` — `restoreForegroundWindow()` 追加: `IsWindow()` チェック → `SetForegroundWindow()` + `BringWindowToTop()`
- [x] 5-3: `src/main/paste-snippet.ts` 新規作成 — `SendInput` で Ctrl+V キーストロークを送る関数
- [x] 5-4: `src/main/index.ts` — `showLauncher()` の先頭で `saveForegroundWindow()` 呼び出し
- [x] 5-5: `src/main/index.ts` — `PASTE_SNIPPET` ハンドラ拡張: clipboard設定 → restore → hide → 150ms待機 → sendCtrlV
- [x] 5-6: `src/main/index.ts` — `snippetPasting` フラグ追加: paste中は `blur` による自動非表示を抑制
- [x] 5-7: クリップボード復元: paste前の内容を保存し、500ms後に戻す (実装済)
- [ ] 5-8: メモ帳・VS Code・ブラウザのテキスト入力欄で貼り付け動作を確認 (実機テスト)

## Phase 6: 仕上げ・エッジケース対応
- [x] 6-1: フッターを動的ヒントに変更: snippet 選択時は `↵ 貼り付け`、それ以外は `↵ 開く`
- [x] 6-2: `restoreForegroundWindow()` を boolean 返却に変更し、復帰失敗時は `sendCtrlV` をスキップ (コピーのみにフォールバック)
- [x] 6-3: `LAUNCH_ITEM` ハンドラに snippet 防衛ガード追加 (誤呼び出しを無視して `hideLauncher()` のみ実行)
- [x] 6-4: 既存アイテム (folder/app/url) への影響なしをコードレビューで確認
- [x] 6-5: `tsc --noEmit` で最終型チェック — エラーなし
