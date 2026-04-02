# OpenCode ワークスペースへようこそ！
# Welcome to OpenCode Workspace!

![Version](https://img.shields.io/badge/version-1.0-blue)
![Status](https://img.shields.io/badge/status-ready-success)

---

## 📋 概要 / Overview

このワークスペースは OpenCode のネイティブ形式で構成されています。

This workspace uses OpenCode's native format configuration.

### 🎉 システム構成 / System Configuration

- ✅ **48個のスキル** / 48 domain-specific skills
- ✅ **21個のエージェント** / 21 specialist agents
- ✅ **12個のコマンド** / 12 custom commands
- ✅ **ユーティリティスクリプト** / Utility scripts
- ✅ **エージェント設定は permission 統合** / Agent configs unified under permission (tools deprecated)

**バージョン / Version**: 1.0

---

## 🚀 クイックスタート / Quick Start

### 3ステップで始めよう / Get Started in 3 Steps

#### 1. OpenCode を起動 / Start OpenCode

```bash
opencode
```

#### 2. ステータスを確認 / Check Status

```
/status
```

#### 3. 最初のコマンドを試す / Try Your First Command

```
/plan simple-project
```
→ 出力: `./specs/{slug}/{slug}-plan.md` と `./specs/{slug}/{slug}-task.md`

---

## 📚 ドキュメント / Documentation

### 📖 ドキュメント一覧 / Documentation List

| ドキュメント | 説明 | 読む時間 |
|-----------|------|---------|
| [**📘 USER_GUIDE.md**](USER_GUIDE.md) | 詳細な使い方マニュアル（バイリンガル） | 15-20分 |
| [**⚡ QUICK_REFERENCE.md**](QUICK_REFERENCE.md) | クイックチートシート | 3-5分 |
| [**💼 PRACTICAL_GUIDE.md**](PRACTICAL_GUIDE.md) | 実践的なシナリオガイド | 20-30分 |
| [**📑 DOCS_INDEX.md**](DOCS_INDEX.md) | ドキュメントインデックス | 5分 |

### 🎯 あなたに合ったドキュメント / Find Your Document

#### 初めて使う方 / First Time?

👉 **[USER_GUIDE.md](USER_GUIDE.md)** から始めてください

Start with **[USER_GUIDE.md](USER_GUIDE.md)**

- 基本的な使い方が網羅されています
- バイリンガル（日本語・英語）
- ステップバイステップの説明

#### 早く知りたい方 / In a Hurry?

👉 **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** をチェック

Check **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)**

- よく使うコマンド一覧
- エージェント一覧
- キーボードショートカット
- 1ページで完結

#### 実践的に学びたい方 / Want to Practice?

👉 **[PRACTICAL_GUIDE.md](PRACTICAL_GUIDE.md)** で学習

Learn with **[PRACTICAL_GUIDE.md](PRACTICAL_GUIDE.md)**

- 5つの実践的なシナリオ
- 詳細なステップ
- 実際のコード例

---

## 🤖 利用可能な機能 / Available Features

### コマンド / Commands (12個)

Type `/` in OpenCode TUI:

| コマンド | 説明 | 例 |
|---------|------|-----|
| `/status` | プロジェクト状態 / Status | `/status` |
| `/plan` | 計画作成 / Plan | `/plan blog site` |
| `/create` | アプリ作成 / Create | `/create todo app` |
| `/enhance` | 機能追加 / Enhance | `/enhance add dark mode` |
| `/debug` | デバッグ / Debug | `/debug API error` |
| `/test` | テスト / Test | `/test coverage` |
| `/deploy` | デプロイ / Deploy | `/deploy production` |
| `/docs` | ドキュメント / Docs | `/docs generate` |
| `/preview` | プレビュー / Preview | `/preview start` |
| `/brainstorm` | ブレインストーム / Brainstorm | `/brainstorm auth system` |
| `/orchestrate` | マルチエージェント / Multi-agent | `/orchestrate full-stack` |
| `/ui-ux-pro-max` | UI/UXデザイン / Design | `/ui-ux-pro-max dashboard` |

### エージェント / Agents (21個)

**Primary Agents** (Tabキーで切り替え):
- `@orchestrator` - マルチエージェント調整
- `@project-planner` - タスク計画

**Subagents** (@で呼び出し):
- `@frontend-specialist` - React/Next.js/UI
- `@backend-specialist` - API/バックエンド
- `@database-architect` - データベース設計
- `@security-auditor` - セキュリティ監査
- `@test-engineer` - テスト戦略
- `@devops-engineer` - デプロイ/CI/CD
- `@debugger` - デバッグ
- `@performance-optimizer` - パフォーマンス
- [他12個 / 12 more]

### スキル / Skills (48個)

- **Frontend**: nextjs-react-expert, tailwind-patterns, web-design-guidelines
- **Backend**: api-patterns, database-design, nodejs-best-practices, python-patterns
- **Testing**: testing-patterns, systematic-debugging, clean-code
- [他39個 / 39 more]

---

## 🎓 学習パス / Learning Paths

### 初心者コース / Beginner Course (30分)

```
1. QUICK_REFERENCE.md (5分)
   ↓
2. USER_GUIDE.md §1-3 (15分)
   ↓
3. PRACTICAL_GUIDE.md シナリオ1 (10分)
   ↓
4. 実際に試す / Practice
```

### 中級者コース / Intermediate Course (1時間)

```
1. USER_GUIDE.md 全体 (20分)
   ↓
2. PRACTICAL_GUIDE.md シナリオ1-3 (30分)
   ↓
3. 自分のプロジェクトで試す / Try on your project
```

### 上級者コース / Advanced Course (2時間)

```
1. PRACTICAL_GUIDE.md 全体 (40分)
   ↓
2. カスタマイズと最適化 / Customize and optimize
```

---

## 💡 よくある質問 / Frequently Asked Questions

### Q: 最初に何をすればいいですか？/ What should I do first?

**A:**
1. [USER_GUIDE.md](USER_GUIDE.md) を読む (15分)
2. `opencode` を起動
3. `/status` を試す
4. `/plan simple-task` で計画を作成

### Q: エージェントはどう使いますか？/ How do I use agents?

**A:**
```
@frontend-specialist Reactコンポーネントを作成して
```

詳細は [USER_GUIDE.md §4](USER_GUIDE.md#4-エージェントの使い方--using-agents) を参照

### Q: コマンドが動かないときは？/ What if commands don't work?

**A:**
1. `/` キーを押してコマンドパレットを開く
2. コマンド名が正しいか確認
3. [USER_GUIDE.md §7](USER_GUIDE.md#7-トラブルシューティング--troubleshooting) を参照

---

## 📊 プロジェクト構造 / Project Structure

```
.
├── README_JA.md                   # このファイル / This file
├── USER_GUIDE.md                  # 詳細な使い方 / Detailed guide
├── QUICK_REFERENCE.md             # クイックリファレンス / Quick ref
├── PRACTICAL_GUIDE.md             # 実践ガイド / Practical guide
├── DOCS_INDEX.md                  # ドキュメント索引 / Doc index
├── AGENTS.md                      # プロジェクトルール / Project rules
│
└── .opencode/                     # OpenCode 設定 / Config
    ├── agents/                    # 21 エージェント / 21 agents
    ├── skills/                    # 48 スキル / 48 skills
    ├── commands/                  # 12 コマンド / 12 commands
    ├── scripts/                   # Python スクリプト / Python scripts
    └── README.md                  # コマンド詳細 / Command details
```

---

## 🔧 システム要件 / System Requirements

- **OpenCode**: 最新版 / Latest version
- **Node.js**: 18+ (推奨 / recommended)
- **Python**: 3.8+ (スクリプト実行用 / for scripts)
- **OS**: Linux, macOS, Windows

---

## 🚀 次のステップ / Next Steps

### 1. ドキュメントを読む / Read Documentation

```
📘 初心者 / Beginner:
   → USER_GUIDE.md

⚡ 経験者 / Experienced:
   → QUICK_REFERENCE.md

💼 実践者 / Practitioner:
   → PRACTICAL_GUIDE.md
```

### 2. OpenCode を起動 / Start OpenCode

```bash
opencode
```

### 3. 最初のコマンドを試す / Try First Command

```
/status
```

### 4. 計画を作成 / Create a Plan

```
/plan simple-project
```

---

## 🆘 サポート / Support

### ドキュメント / Documentation

- **[OpenCode 公式ドキュメント](https://opencode.ai/docs/)**
- **[USER_GUIDE.md](USER_GUIDE.md)** - 詳細な使い方
- **[AGENTS.md](AGENTS.md)** - プロジェクトルール

### コミュニティ / Community

- **[GitHub Issues](https://github.com/anomalyco/opencode/issues)**
- **[Discord](https://opencode.ai/discord)**

### ローカルヘルプ / Local Help

```
/help                           # 一般ヘルプ / General help
/status                         # 現状確認 / Check status
@orchestrator 使い方を教えて     # 質問する / Ask questions
```

---

## 📈 ロードマップ / Roadmap

### v1.0 (2026-01-31) - 現在 / Current

- ✅ 完全なシステム構築 / Full system setup
- ✅ 48スキル、21エージェント、12コマンド / 48 skills, 21 agents, 12 commands
- ✅ 包括的なドキュメント / Comprehensive documentation

### v1.1 (計画中 / Planned)

- 🔄 追加のスキル / More skills
- 🔄 カスタムコマンドの拡張 / Extended custom commands
- 🔄 パフォーマンス最適化 / Performance optimization

---

## 📝 更新履歴 / Changelog

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2026-01-31 | 1.0 | 初版リリース / Initial release |

---

## 📄 ライセンス / License

このプロジェクトは MIT ライセンスの下で提供されています。

This project is licensed under the MIT License.

---

## 🎉 まとめ / Summary

**OpenCode へようこそ！/ Welcome to OpenCode!**

- 📚 **詳細なドキュメント**: [USER_GUIDE.md](USER_GUIDE.md)
- ⚡ **クイックリファレンス**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- 💼 **実践ガイド**: [PRACTICAL_GUIDE.md](PRACTICAL_GUIDE.md)

**すぐに始めよう / Get Started Now**:
```bash
opencode
/status
```

---

**バージョン**: 1.0
**最終更新**: 2026-02-06
**システム**: OpenCode

---

*Happy Coding! / ハッピーコーディング！*
