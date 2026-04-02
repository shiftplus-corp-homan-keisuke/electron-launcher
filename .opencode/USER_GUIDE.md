# OpenCode User Guide

**最終更新**: 2026-01-31
**バージョン**: 1.0

---

## 目次 / Table of Contents

1. [はじめに / Getting Started](#1-はじめに--getting-started)
2. [OpenCode TUI の基本 / OpenCode TUI Basics](#2-opencode-tui-の基本--opencode-tui-basics)
3. [コマンドの使い方 / Using Commands](#3-コマンドの使い方--using-commands)
4. [エージェントの使い方 / Using Agents](#4-エージェントの使い方--using-agents)
5. [スキルの使い方 / Using Skills](#5-スキルの使い方--using-skills)
6. [実践的なワークフロー / Practical Workflows](#6-実践的なワークフロー--practical-workflows)
7. [トラブルシューティング / Troubleshooting](#7-トラブルシューティング--troubleshooting)
8. [高度な使い方 / Advanced Usage](#8-高度な使い方--advanced-usage)

---

## 1. はじめに / Getting Started

### 概要 / Overview

このワークスペースは OpenCode のネイティブ形式で構成されています。

This workspace uses OpenCode native format.

### 利用可能な機能 / Available Features

- 🔧 **11個のカスタムコマンド** / 11 custom commands
- 🤖 **20個の専門エージェント** / 20 specialist agents
- 📚 **47個のドメインスキル** / 47 domain-specific skills
- 🛠️ **Pythonスクリプト** / Python scripts (unchanged)

### クイックスタート / Quick Start

```bash
# OpenCode を起動 / Start OpenCode
opencode

# ステータス確認 / Check status
/status

# ヘルプ表示 / Show help
/help
```

---

## 2. OpenCode TUI の基本 / OpenCode TUI Basics

### 起動と終了 / Starting and Exiting

```bash
# 起動 / Start
opencode

# 終了 / Exit
Ctrl+C または type: exit
```

### 基本操作 / Basic Operations

| 操作 / Operation | キー / Key | 説明 / Description |
|-----------------|-----------|---------------------|
| コマンド入力 / Command input | `/` | コマンドパレットを開く / Open command palette |
| エージェント選択 / Agent selection | `Tab` | Primaryエージェントを切り替え / Cycle primary agents |
| エージェントメンション / Agent mention | `@` | エージェントを入力補完 / Mention agents |
| メッセージ送信 / Send message | `Enter` | 現在の入力を送信 / Send current input |
| 履歴ナビゲーション / History nav | `↑` `↓` | コマンド履歴を移動 / Navigate command history |
| 中断 / Abort | `Ctrl+C` | 現在の操作をキャンセル / Cancel current operation |

### モードの理解 / Understanding Modes

**Build モード** (デフォルト / Default):
- 全てのツールが利用可能 / All tools available
- ファイルの読み書きが可能 / Can read and write files
- 実行向け / For execution

**Plan モード**:
- 読み取り専用 / Read-only
- 計画と分析向け / For planning and analysis
- ファイル変更を要求 / Ask for file changes

---

## 3. コマンドの使い方 / Using Commands

### コマンド一覧 / Command List

| コマンド | 説明 | 使用例 |
|---------|------|--------|
| `/status` | プロジェクト状態表示 / Show project status | `/status` |
| `/preview` | プレビューサーバー管理 / Manage preview server | `/preview start` |
| `/brainstorm` | アイデア出し / Brainstorm ideas | `/brainstorm auth system` |
| `/plan` | プロジェクト計画 / Create project plan | `/plan e-commerce app` |
| `/create` | アプリ作成 / Build application | `/create todo app` |
| `/enhance` | 機能追加 / Add features | `/enhance add dark mode` |
| `/debug` | デバッグ / Debug issues | `/debug API error` |
| `/test` | テスト / Testing | `/test coverage` |
| `/deploy` | デプロイ / Deploy | `/deploy production` |
| `/orchestrate` | マルチエージェント / Multi-agent | `/orchestrate full-stack app` |
| `/ui-ux-pro-max` | UI/UXデザイン / Design system | `/ui-ux-pro-max dashboard` |

### 基本的な使い方 / Basic Usage

#### ステータス確認 / Check Status

```
/status
```

**出力例 / Output Example**:
```
=== Project Status ===

📁 Project: my-project
🏷️ Type: nextjs
📊 Status: active

🔧 Tech Stack:
   Framework: Next.js 14
   Language: TypeScript
   Package Manager: npm

✅ Features: (5)
   • product-listing
   • shopping-cart
   • user-auth
   • checkout
   • order-history

=== Preview ===
🌐 URL: http://localhost:3000
💚 Health: OK
```

#### プロジェクト計画 / Project Planning

```
/plan e-commerce site with shopping cart
```

**実行される内容 / What Happens**:
1. 要件分析 / Requirements analysis
2. 必要に応じて質問 / Questions if needed
3. `./specs/ecommerce-site/ecommerce-site-plan.md` 作成 / Create plan file
4. `./specs/ecommerce-site/ecommerce-site-task.md` 作成 / Create task list
4. タスク分解 / Task breakdown

**作成される計画ファイル / Plan File Created**:
```markdown
# Project Plan: E-commerce Site

## Overview
E-commerce website with product catalog and shopping cart

## Tech Stack
- Framework: Next.js 14
- Database: PostgreSQL
- Auth: NextAuth.js
- Payment: Stripe

## Task Breakdown

### Phase 1: Setup
- [ ] Initialize Next.js project
- [ ] Configure PostgreSQL
- [ ] Set up authentication

### Phase 2: Core Features
- [ ] Product catalog
- [ ] Shopping cart
- [ ] Checkout flow
```

#### アプリケーション作成 / Create Application

```
/create blog site with markdown support
```

**実行される内容 / What Happens**:
1. 要件収集 / Gather requirements
2. 技術スタック選定 / Select tech stack
3. プロジェクト構造作成 / Create project structure
4. コア機能実装 / Implement core features
5. プレビュー起動 / Start preview

#### デバッグ / Debug Issues

```
/debug login returns 500 error
```

**実行される内容 / What Happens**:
1. エラーコンテキスト収集 / Gather error context
2. 最近の変更を確認 / Check recent changes
3. 仮説立案 / Form hypotheses
4. システマティックな調査 / Systematic investigation
5. 修正と予防策 / Fix and prevention

#### テスト / Testing

```
/test src/services/auth.service.ts
```

**または / Or**:
```
/test coverage
```

**実行される内容 / What Happens**:
- コード分析 / Code analysis
- テストケース生成 / Generate test cases
- テスト実行 / Run tests
- カバレッジレポート / Coverage report

---

## 4. エージェントの使い方 / Using Agents

### エージェントの種類 / Agent Types

#### Primary Agents (メインエージェント)

`Tab` キーで切り替え / Switch with `Tab` key:

- **`@orchestrator`**: マルチエージェント調整 / Multi-agent coordination
- **`@project-planner`**: タスク計画 / Task planning

#### Subagents (専門エージェント)

`@` で明示的に呼び出し / Explicitly mention with `@`:

- **`@frontend-specialist`**: React/Next.js/UI
- **`@backend-specialist`**: Node.js/Python/API
- **`@database-architect`**: データベース設計 / Database design
- **`@security-auditor`**: セキュリティ監査 / Security audit
- **`@test-engineer`**: テスト戦略 / Testing strategy
- **`@devops-engineer`**: デプロイ/CI/CD
- **`@debugger`**: デバッグ / Debugging
- **`@performance-optimizer`**: パフォーマンス最適化 / Performance
- **`@explorer-agent`**: コードベース探索 / Codebase exploration
- [他11個 / 11 more]

### エージェントの使い方 / How to Use Agents

#### 方法1: 直接メンション / Method 1: Direct Mention

```
@frontend-specialist Reactコンポーネントを作成して

@frontend-specialist Create a React component
```

#### 方法2: Tabキーで切り替え / Method 2: Tab Key

1. `Tab` キーを押して primaryエージェントを選択 / Press `Tab` to select primary agent
2. メッセージを入力 / Type your message

```
[Tab を押して orchestrator を選択]
複雑なタスクを調整して
```

#### 方法3: コマンド経由 / Method 3: Via Commands

```
/orchestrate build full-stack app
```

### エージェント使用例 / Agent Usage Examples

#### Frontend Specialist

```
@frontend-specialist
Next.js 14で製品カードコンポーネントを作成して
Tailwind CSSでスタイリングしてください
```

**応答 / Response**:
- React/Next.jsのベストプラクティスを適用 / Applies React/Next.js best practices
- 必要に応じてスキルをロード / Loads skills when needed
- パフォーマンスを考慮 / Considers performance

#### Database Architect

```
@database-architect
Eコマースサイトのための
注文管理のスキーマを設計して
```

**応答 / Response**:
- 正規化されたスキーマ設計 / Normalized schema design
- インデックス戦略 / Indexing strategy
- リレーションシップ / Relationships

#### Orchestrator

```
@orchestrator
認証機能付きのフルスタックアプリを構築して
データベース、API、フロントエンド全て含めて
```

**応答 / Response**:
- 複数のエージェントを並列で起動 / Invokes multiple agents in parallel
- タスクを調整 / Coordinates tasks
- 統合レポート作成 / Creates integrated report

---

## 5. スキルの使い方 / Using Skills

### スキルとは / What are Skills?

スキルはエージェントがオンデマンドでロードする専門知識パッケージです。

Skills are specialized knowledge packages that agents load on-demand.

### 主なスキル / Key Skills

#### フロントエンド / Frontend

- `nextjs-react-expert`: React/Next.js最適化（57ルール） / Optimization (57 rules)
- `tailwind-patterns`: Tailwind CSSユーティリティ / Utilities
- `web-design-guidelines`: UI/UX監査（100+ルール） / UI/UX audit (100+ rules)

#### バックエンド / Backend

- `api-patterns`: REST/GraphQL/tRPCパターン / Patterns
- `database-design`: スキーマ最適化 / Schema optimization
- `nodejs-best-practices` / `python-patterns`: 言語標準 / Language standards

#### テストと品質 / Testing & Quality

- `testing-patterns`: Jest/Vitest/pytest戦略 / Strategies
- `systematic-debugging`: 4フェーズデバッグ / 4-phase debugging
- `clean-code`: プラグマティックコーディング標準 / Coding standards

### スキルの使い方 / How to Use Skills

#### 自動ロード / Automatic Loading

エージェントが必要に応じて自動的にロード / Agents load automatically when needed:

```
@frontend-specialist パフォーマンスを最適化して

[エージェントが自動的に nextjs-react-expert スキルをロード]
[Agent automatically loads nextjs-react-expert skill]
```

#### 手動ロード / Manual Loading

エージェントのプロンプトに「Available Skills」セクションがあります。

Agents have an "Available Skills" section in their prompt:

```
@frontend-specialist
Next.jsのパフォーマンス問題を調査して

[エージェントの応答]
使用するスキルをロードしています:
skill({ name: "nextjs-react-expert" })
```

### スキル一覧（抜粋） / Skill List (Partial)

```
全部で48個のスキルが利用可能 / 48 skills available

主なスキル / Key skills:
- clean-code
- nextjs-react-expert
- tailwind-patterns
- testing-patterns
- api-patterns
- database-design
- systematic-debugging
- web-design-guidelines
[... 39 more]
```

---

## 6. 実践的なワークフロー / Practical Workflows

### ワークフロー1: 新しいプロジェクトの開始 / Workflow 1: Starting a New Project

```
# 1. 計画を作成 / Create plan
/plan e-commerce site with product catalog

# 2. 計画を確認 / Review plan
[./specs/ecommerce-site/ecommerce-site-plan.md が作成される]
[./specs/ecommerce-site/ecommerce-site-task.md が作成される]

# 3. アプリを作成 / Create application
/create e-commerce site

# 4. 機能を追加 / Add features
/enhance add user authentication

# 5. テスト / Test
/test

# 6. デプロイ / Deploy
/deploy
```

### ワークフロー2: バグ修正 / Workflow 2: Bug Fixing

```
# 1. デバッグ開始 / Start debugging
/debug login not working

# 2. 問題を調査 / Investigate issue
[情報収集と仮説立案]

# 3. エージェントを呼び出して修正 / Call agent to fix
@backend-specialist 認証ロジックを修正して

# 4. テストで確認 / Verify with tests
/test src/services/auth.service.ts

# 5: レグレッションテスト / Regression test
/test
```

### ワークフロー3: UIデザイン / Workflow 3: UI Design

```
# 1. デザインシステムを取得 / Get design system
/ui-ux-pro-max fintech dashboard modern

# 2. フロントエンドエージェントに実装 / Implement with frontend agent
@frontend-specialist
デザインシステムを適用してダッシュボードを作成して

# 3. レスポンシブ確認 / Check responsive
@frontend-specialist
モバイル版のレイアウトを調整して

# 4. アクセシビリティチェック / Accessibility check
@frontend-specialist
アクセシビリティを監査して
```

### ワークフロー4: 複雑なマルチドメインタスク / Workflow 4: Complex Multi-Domain Tasks

```
# オーケストレーターを使用 / Use orchestrator
@orchestrator
SaaSアプリケーションを構築して
要件:
- 認証システム
- データベース設計
- REST API
- Reactフロントエンド
- テスト自動化
- CI/CDパイプライン

[orchestratorが複数のエージェントを調整]
[Orchestrator coordinates multiple agents:
 - @database-architect: スキーマ設計
 - @backend-specialist: API開発
 - @frontend-specialist: UI実装
 - @test-engineer: テスト戦略
 - @devops-engineer: デプロイ設定]
```

---

## 7. トラブルシューティング / Troubleshooting

### よくある問題 / Common Issues

#### 問題1: コマンドが見つからない / Problem 1: Command Not Found

**症状 / Symptoms**:
```
/error: Command not found
```

**解決策 / Solution**:
1. `/` キーを押してコマンドパレットを開く / Press `/` to open command palette
2. 利用可能なコマンドを確認 / Check available commands
3. コマンド名が正しいか確認 / Verify command name is correct

#### 問題2: エージェントが応答しない / Problem 2: Agent Not Responding

**症状 / Symptoms**:
```
@frontend-specialist
[No response]
```

**解決策 / Solution**:
1. `@` の後にスペースを入れる / Add space after `@`
2. エージェント名が正しいか確認 / Verify agent name is correct
3. `Tab` キーで primary エージェントを切り替え / Try switching primary agents with `Tab`

#### 問題3: スキルがロードされない / Problem 3: Skill Not Loading

**症状 / Symptoms**:
```
Expected skill to be loaded but wasn't
```

**解決策 / Solution**:
1. エージェントに明示的に依頼 / Explicitly ask the agent:
   ```
   clean-codeスキルをロードしてください
   Please load the clean-code skill
   ```
2. エージェントの「Available Skills」を確認 / Check agent's "Available Skills"

#### 問題4: プレビューサーバーが起動しない / Problem 4: Preview Server Won't Start

**症状 / Symptoms**:
```
/preview start
[Error: Port already in use]
```

**解決策 / Solution**:
```
# ポートを確認 / Check port
/preview status

# 異なるポートで起動 / Start on different port
/preview start 3001

# またはプロセスをkill / Or kill process
/preview stop
/preview start
```

### ヘルプを得る方法 / Getting Help

#### コマンド内ヘルプ / In-Command Help

```
/help
```

#### エージェントに質問 / Ask Agents

```
@orchestrator 使い方を教えて
@orchestrator How do I use this system?
```

#### ドキュメント参照 / Documentation

- **AGENTS.md**: プロジェクトルール / Project rules
- **.opencode/README.md**: コマンドリファレンス / Command reference

---

## 8. 高度な使い方 / Advanced Usage

### カスタムコマンドの作成 / Creating Custom Commands

`.opencode/commands/` に新しい `.md` ファイルを作成 / Create new `.md` file:

```markdown
---
description: Run custom task
---

Custom command instructions here.
```

例 / Example:
```markdown
---
description: Generate API documentation
---

Generate API documentation for the project.

Steps:
1. Read all route files
2. Extract endpoints
3. Generate OpenAPI spec
4. Save to docs/API.md

$ARGUMENTS
```

使用 / Usage:
```
/api-docs users
```

### エージェントのカスタマイズ / Customizing Agents

エージェントファイルを編集 / Edit agent files:

```bash
.opencode/agents/frontend-specialist.md
```

カスタマイズ可能な項目 / Customizable fields:
- `description`: エージェントの説明 / Agent description
- `tools`: 利用可能なツール / Available tools
- `permission`: ツール権限 / Tool permissions

### スキルの追加 / Adding Skills

1. 新しいスキルディレクトリを作成 / Create new skill directory:
```bash
mkdir -p .opencode/skills/my-skill
```

2. `SKILL.md` を作成 / Create `SKILL.md`:
```markdown
---
name: my-skill
description: My custom skill
license: MIT
compatibility: opencode
---

# My Custom Skill

Instructions here...
```

3. エージェントから参照可能 / Reference from agents

### 環境変数の設定 / Setting Environment Variables

```bash
# OpenCode設定 / OpenCode config
~/.config/opencode/opencode.json

# またはプロジェクト設定 / Or project config
.opencode/opencode.json
```

例 / Example:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-20250514",
  "temperature": 0.3,
  "agent": {
    "build": {
      "tools": {
        "bash": true,
        "write": true
      }
    }
  }
}
```

---

## クイックリファレンス / Quick Reference

### キーボードショートカット / Keyboard Shortcuts

| キー / Key | アクション / Action |
|-----------|-------------------|
| `/` | コマンドパレット / Command palette |
| `@` | エージェントメンション / Agent mention |
| `Tab` | Primaryエージェント切り替え / Cycle primary agents |
| `Enter` | 送信 / Send |
| `Ctrl+C` | 中断 / Abort |

### よく使うコマンド / Frequently Used Commands

```
/status                    # 現状把握 / Check status
/plan [task]              # 計画作成 / Create plan
/create [app]             # アプリ作成 / Build app
@agent-name               # エージェント呼び出し / Call agent
/debug [issue]            # デバッグ / Debug
/test                     # テスト実行 / Run tests
/deploy                   # デプロイ / Deploy
```

### よく使うエージェント / Frequently Used Agents

```
@orchestrator              # マルチエージェント調整 / Multi-agent
@frontend-specialist       # React/Next.js/UI
@backend-specialist        # API/バックエンド / Backend
@database-architect        # データベース / Database
@test-engineer            # テスト / Testing
@debugger                 # デバッグ / Debugging
```

---

## 用語集 / Glossary

| 用語 / Term | 説明 / Description |
|-----------|-------------------|
| **Agent** | AIアシスタントの専門家ペルソナ / Specialist AI persona |
| **Skill** | オンデマンドでロードされる知識パッケージ / Knowledge package loaded on-demand |
| **Command** | `/` で実行する特殊なプロンプト / Special prompt executed with `/` |
| **Primary Agent** | `Tab` で切り替えるメインエージェント / Main agent switched with `Tab` |
| **Subagent** | `@` で呼び出す専門家エージェント / Specialist agent called with `@` |
| **TUI** | Terminal User Interface / ターミナルユーザーインターフェース |

---

## サポート / Support

### ドキュメント / Documentation

- **OpenCode 公式**: https://opencode.ai/docs/
- **AGENTS.md**: プロジェクトルール / Project rules

### コミュニティ / Community

- **GitHub Issues**: https://github.com/anomalyco/opencode/issues
- **Discord**: https://opencode.ai/discord

### ローカルヘルプ / Local Help

```
/help                          # 一般ヘルプ / General help
@orchestrator 使い方を教えて   # エージェントに質問 / Ask agent
```

---

## チェックリスト / Checklist

### 初回使用時 / First Time Use

- [ ] OpenCode をインストール / Install OpenCode
- [ ] `opencode` コマンドで起動 / Start with `opencode`
- [ ] `/status` で動作確認 / Verify with `/status`
- [ ] `/plan simple-task` でテスト / Test with `/plan simple-task`

### 開発開始前 / Before Development

- [ ] `/plan` で計画を作成 / Create plan with `/plan`
- [ ] 計画をレビュー / Review plan
- [ ] 必要なエージェントを確認 / Check required agents

### コミット前 / Before Committing

- [ ] `/test` でテスト実行 / Run tests with `/test`
- [ ] `/debug` で問題がないか確認 / Check for issues with `/debug`
- [ ] `/deploy check` でデプロイ確認 / Verify deployment with `/deploy check`

---

**バージョン**: 1.0
**最終更新**: 2026-01-31
**システム**: OpenCode


---

*このマニュアルは OpenCode ワークスペース用に作成されました*
*This manual was created for OpenCode workspace*
