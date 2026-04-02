# OpenCode ドキュメントインデックス
# OpenCode Documentation Index

**最終更新**: 2026-02-06

---

## 📚 ドキュメント一覧 / Document List

このプロジェクトには包括的なドキュメントが含まれています。

This project includes comprehensive documentation created after OpenCode migration.

### メインドキュメント / Main Documentation

| ドキュメント | 説明 | 対象者 |
|-----------|------|--------|
| **USER_GUIDE.md** | 詳細な使い方マニュアル（バイリンガル） | 全ユーザー |
| **QUICK_REFERENCE.md** | クイックチートシート | 経験ユーザー |
| **PRACTICAL_GUIDE.md** | 実践的なシナリオベースガイド | 実践者 |

### 設定ドキュメント / Configuration Documentation

| ドキュメント | 説明 |
|-----------|------|
| **AGENTS.md** | プロジェクトルールとガイドライン |
| **.opencode/README.md** | コマンドリファレンス |

---

## 🚀 クイックスタート / Quick Start

### 初めて使う方 / First Time Users

1. **基本を学ぶ / Learn Basics**
   - 👉 **USER_GUIDE.md** を読む
   - セクション1-3をカバー

2. **試してみる / Try It Out**
   ```
   opencode
   /status
   /plan simple-task
   ```

3. **詳しく学ぶ / Learn More**
   - 👉 **PRACTICAL_GUIDE.md** のシナリオを試す

### 経験ユーザー / Experienced Users

1. **クイックリファレンス / Quick Reference**
   - 👉 **QUICK_REFERENCE.md** をブックマーク

2. **詳細なコマンド情報 / Detailed Command Info**
   - 👉 **.opencode/README.md** を参照

---

## 📖 ドキュメント詳細 / Document Details

### 1. USER_GUIDE.md

**長さ**: ~400行 / **Reading Time**: 15-20分

**内容 / Contents**:
- OpenCode TUI の基本
- 全12コマンドの詳細
- エージェントの使い方
- スキルシステムの説明
- 実践的なワークフロー
- トラブルシューティング
- 高度な使い方

**対象 / For**: 全てのユーザー / All users

**目次 / Table of Contents**:
```markdown
1. はじめに / Getting Started
2. OpenCode TUI の基本
3. コマンドの使い方
4. エージェントの使い方
5. スキルの使い方
6. 実践的なワークフロー
7. トラブルシューティング
8. 高度な使い方
```

### 2. QUICK_REFERENCE.md

**長さ**: ~100行 / **Reading Time**: 3-5分

**内容 / Contents**:
- よく使うコマンド一覧
- よく使うエージェント一覧
- キーボードショートカット
- 主なスキル（48個）
- 典型的なワークフロー
- 便利な例
- よくある問題

**対象 / For**: 経験ユーザー / Experienced users

**用途 / Use Case**: 横に置いて参照 / Keep handy for reference

### 3. PRACTICAL_GUIDE.md

**長さ**: ~500行 / **Reading Time**: 20-30分

**内容 / Contents**:
- 5つの実践的なシナリオ
  1. 新しいブログサイトを作成
  2. 認証機能を追加
  3. APIエラーをデバッグ
  4. パフォーマンスを最適化
  5. 本番環境にデプロイ
- 各シナリオは詳細なステップ付き
- 実際のコード例を含む

**対象 / For**: 実践者 / Practitioners

**用途 / Use Case**: 学習と実戦 / Learning and practice


**長さ**: ~700行 / **Reading Time**: 30-40分

**内容 / Contents**:
- ディレクトリ構造の比較
- 検証結果
- ロールバック手順
- 既知の問題と制限

**対象 / For**: 技術者、管理者 / Technical staff, administrators



**長さ**: ~80行 / **Reading Time**: 2-3分

**内容 / Contents**:
- ディレクトリ構造
- 主な変更点
- 使い方の例
- 検証結果
- 次のステップ
- ロールバック手順

**対象 / For**: 管理者 / Managers

**用途 / Use Case**: 概要の把握 / Quick overview

---

## 🎯 使い道 / Use Cases

### 学習パス / Learning Path

#### 初心者コース / Beginner Course

```
1. QUICK_REFERENCE.md (5分)
   ↓
2. USER_GUIDE.md セクション1-3 (15分)
   ↓
3. PRACTICAL_GUIDE.md シナリオ1 (10分)
   ↓
4. 実際に試す / Practice yourself
```

#### 中級者コース / Intermediate Course

```
1. USER_GUIDE.md 全体 (20分)
   ↓
2. PRACTICAL_GUIDE.md シナリオ1-3 (30分)
   ↓
3. 自分のプロジェクトで試す / Try on your project
```

#### 上級者コース / Advanced Course

```
1. PRACTICAL_GUIDE.md 全体 (40分)
   ↓
   ↓
3. カスタマイズと最適化 / Customize and optimize
```

### 参照パス / Reference Path

#### 開発中 / During Development

```
作業中 / Working:
├─ QUICK_REFERENCE.md (デスクトップに常駐)
└─ USER_GUIDE.md (必要に応じて参照)

問題が発生した時 / When issues arise:
└─ PRACTICAL_GUIDE.md 該当シナリオ
```

#### 設定・管理時 / Configuration & Management

```

概要を把握 / Get overview:
```

---

## 📊 ドキュメントマトリックス / Documentation Matrix

| ドキュメント | 長さ | レベル | バイリンガル | 実践的 | 技術的 |
|------------|------|--------|-----------|--------|--------|
| USER_GUIDE.md | ⭐⭐⭐ | 初〜中 | ✅ | ✅ | ⭐⭐ |
| QUICK_REFERENCE.md | ⭐ | 全 | ✅ | ⭐⭐ | ⭐ |
| PRACTICAL_GUIDE.md | ⭐⭐⭐⭐ | 中〜上 | ✅ | ✅✅✅ | ⭐⭐⭐ |

---

## 🔍 検索ガイド / Search Guide

### キーワードで探す / Find by Keyword

#### コマンド関連 / Commands

**何をしたいか / What you want to do**:
- プロジェクトの状態を知りたい / Know project status
  → USER_GUIDE.md §3, QUICK_REFERENCE.md
- 計画を作成したい / Create a plan
  → USER_GUIDE.md §3, PRACTICAL_GUIDE.md シナリオ1
- デプロイしたい / Deploy
  → USER_GUIDE.md §3, PRACTICAL_GUIDE.md シナリオ5

#### エージェント関連 / Agents

**誰に相談したいか / Who to consult**:
- フロントエンドの問題 / Frontend issues
  → USER_GUIDE.md §4, QUICK_REFERENCE.md
- データベース設計 / Database design
  → USER_GUIDE.md §4, PRACTICAL_GUIDE.md シナリオ2
- 複雑なマルチドメインタスク / Complex multi-domain
  → USER_GUIDE.md §4, PRACTICAL_GUIDE.md シナリオ5

#### 問題解決 / Problem Solving

**何が起きているか / What's happening**:
- バグが発生 / Bug found
  → USER_GUIDE.md §7, PRACTICAL_GUIDE.md シナリオ3
- パフォーマンスが悪い / Poor performance
  → PRACTICAL_GUIDE.md シナリオ4
- コマンドが動かない / Command not working
  → USER_GUIDE.md §7, QUICK_REFERENCE.md

---

## 💡 おすすめの読み方 / Recommended Reading Order

### 初回セットアップ時 / Initial Setup

```
1. QUICK_REFERENCE.md (5分)
   → 全体像を把握 / Get overview

2. USER_GUIDE.md §1-2 (10分)
   → 基本を理解 / Understand basics

3. 実際に試す / Try it out
   opencode
   /status
   /plan test
```

### 日常開発 / Daily Development

```
デスクトップに常駐 / Keep on desktop:
└─ QUICK_REFERENCE.md

必要に応じて参照 / Refer as needed:
└─ USER_GUIDE.md
```

### 問題発生時 / When Problems Arise

```
1. QUICK_REFERENCE.md 「よくある問題」 (1分)
   → クイックチェック / Quick check

2. PRACTICAL_GUIDE.md 該当シナリオ (10分)
   → 詳しい手順 / Detailed steps

3. USER_GUIDE.md §7 (5分)
   → トラブルシューティング / Troubleshooting
```

### チームオンボーディング / Team Onboarding

```
新しいメンバー / New member:
┌─────────────────────────────────────┐
│ Day 1:                              │
│   - QUICK_REFERENCE.md (15分)       │
│   - USER_GUIDE.md §1-3 (30分)       │
│   - 簡単なタスクを試す / Try simple │
├─────────────────────────────────────┤
│ Day 2:                              │
│   - USER_GUIDE.md §4-6 (30分)       │
│   - PRACTICAL_GUIDE.md シナリオ1-2 │
├─────────────────────────────────────┤
│ Day 3:                              │
│   - PRACTICAL_GUIDE.md シナリオ3-5 │
│   - 実際のプロジェクトで作業 / Work │
└─────────────────────────────────────┘
```

---

## 🔧 カスタマイズ / Customization

### プロジェクト固有のドキュメント追加 / Add Project-Specific Docs

```markdown
# PROJECT_GUIDE.md

## プロジェクト概要 / Project Overview
[Your project details]

## プロジェクト固有のワークフロー / Project-Specific Workflows
[Your custom workflows]

## チームのルール / Team Rules
[Your team rules]
```

### 既存ドキュメントの拡張 / Extend Existing Docs

```
USER_GUIDE.md にセクション追加:
- プロジェクト固有のコマンド
- チームのベストプラクティス
```

---

## 📝 フィードバック / Feedback

### ドキュメントの改善 / Improve Documentation

見つけた誤字や改善提案は:

1. **GitHub Issues**: https://github.com/anomalyco/opencode/issues
2. **直接編集 / Edit Directly**:
   - ドキュメントはMarkdown
   - プルリクエストを送信

### 追加してほしい内容 / Content Requests

以下の情報を含めてリクエスト:

- 必要な内容 / What's needed
- ユースケース / Use case
- 対象レベル / Target level

---

## 🔄 更新履歴 / Update History

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2026-01-31 | 1.0 | 初版作成 / Initial release |

---

## 📞 サポート / Support

### ヘルプリソース / Help Resources

- **OpenCode Docs**: https://opencode.ai/docs/
- **Community**: https://opencode.ai/discord
- **Issues**: https://github.com/anomalyco/opencode/issues

### ローカルヘルプ / Local Help

```
/help                           # 一般ヘルプ
/status                         # 現状確認
@orchestrator 使い方を教えて     # 質問する
```

---

## 🎓 学習リソース / Learning Resources

### 公式ドキュメント / Official Documentation

- [OpenCode Commands](https://opencode.ai/docs/commands/)
- [OpenCode Agents](https://opencode.ai/docs/agents/)
- [OpenCode Skills](https://opencode.ai/docs/skills/)

### プロジェクトドキュメント / Project Documentation

- AGENTS.md - プロジェクトルール
- .opencode/README.md - コマンド詳細
- .opencode/agents/ - エージェント定義
- .opencode/skills/ - スキル定義

---

**バージョン**: 1.0
**最終更新**: 2026-01-31
**メンテナ**: OpenCode Migration Team

---

*このドキュメントインデックスは OpenCode ワークスペース用に作成されました*
*This document index was created after OpenCode migration*
