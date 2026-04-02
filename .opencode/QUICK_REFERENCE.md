# OpenCode クイックチートシート
# OpenCode Quick Cheat Sheet

**最終更新**: 2026-01-31

---

## 🔥 よく使うコマンド / Frequently Used Commands

| コマンド | 説明 | 例 |
|---------|------|-----|
| `/status` | プロジェクト状態 | `/status` |
| `/plan [task]` | 計画作成 | `/plan blog site` |
| `/create [app]` | アプリ作成 | `/create todo app` |
| `/enhance [feature]` | 機能追加 | `/enhance add dark mode` |
| `/debug [issue]` | デバッグ | `/debug API error` |
| `/test` | テスト | `/test coverage` |
| `/deploy` | デプロイ | `/deploy production` |
| `/preview [cmd]` | プレビュー | `/preview start` |

---

## 🤖 よく使うエージェント / Frequently Used Agents

### Primary Agents (Tabキーで切り替え)

- `@orchestrator` - マルチエージェント調整
- `@project-planner` - タスク計画

### Subagents (@で呼び出し)

| エージェント | 用途 |
|-----------|------|
| `@frontend-specialist` | React/Next.js/UI |
| `@backend-specialist` | API/バックエンド |
| `@database-architect` | データベース設計 |
| `@security-auditor` | セキュリティ監査 |
| `@test-engineer` | テスト戦略 |
| `@devops-engineer` | デプロイ/CI/CD |
| `@debugger` | デバッグ |
| `@performance-optimizer` | パフォーマンス |
| `@explorer-agent` | コードベース探索 |

---

## ⌨️ キーボードショートカット

| キー | アクション |
|-----|---------|
| `/` | コマンドパレットを開く |
| `@` | エージェントを入力補完 |
| `Tab` | Primaryエージェント切り替え |
| `Enter` | メッセージ送信 |
| `Ctrl+C` | 操作を中断 |

---

## 📚 主なスキル（47個利用可能）

### Frontend
- `nextjs-react-expert` - React/Next.js (57ルール)
- `tailwind-patterns` - Tailwind CSS
- `web-design-guidelines` - UI/UX

### Backend
- `api-patterns` - REST/GraphQL
- `database-design` - スキーマ設計
- `nodejs-best-practices` / `python-patterns`

### Quality
- `testing-patterns` - テスト戦略
- `clean-code` - コーディング標準
- `systematic-debugging` - デバッグ手法

---

## 🔄 典型的なワークフロー

### 新規プロジェクト
```
/plan e-commerce site
/create e-commerce site
/test
/deploy
```

### バグ修正
```
/debug login error
@backend-specialist fix authentication
/test auth.service.ts
```

### UI開発
```
/ui-ux-pro-max dashboard
@frontend-specialist implement design
```

### 複雑なタスク
```
@orchestrator build full-stack app with auth, db, api, ui
```

---

## 💡 便利な例

### コード生成
```
@frontend-specialist
Next.js 14でユーザープロファイルコンポーネントを作成して
TypeScriptとTailwind CSSを使用
```

### データベース設計
```
@database-architect
マルチテナントSaaSのスキーマ設計して
PostgreSQLを使用
```

### テスト生成
```
@test-engineer
認証ロジックのテストを書いて
JestとTypeScript使用
```

### パフォーマンス最適化
```
@performance-optimizer
ページロードが遅い原因を調査して
Next.jsアプリ
```

---

## ⚠️ よくある問題

### コマンドが見つからない
→ `/` キーを押してコマンドパレットを開く

### エージェントが応答しない
→ `@` の後にスペースを入れる
→ エージェント名を確認

### ポート競合
```
/preview stop
/preview start 3001
```

---

## 📖 詳細ドキュメント

- **USER_GUIDE.md** - 詳細な使い方マニュアル
- **MIGRATION_REPORT.md** - 移行レポート
- **AGENTS.md** - プロジェクトルール
- **.opencode/README.md** - コマンド詳細

---

## 🆘 ヘルプ

```
/help                           # 一般ヘルプ
/status                         # 現状確認
@orchestrator 使い方を教えて     # 質問する
```

---

**バージョン**: 1.0 | **更新**: 2026-01-31
