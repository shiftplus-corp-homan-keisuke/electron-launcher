---
description: 現在のブランチのコードレビューを実施
---

# コードレビューワークフロー

現在のブランチで行われた変更の包括的なコードレビューを実施します。

## プロジェクト固有のアーキテクチャ

このプロジェクト (`front/analyze`) では以下の最新技術スタックとアーキテクチャを採用しています:

### **コア技術スタック**
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4 + Shadcn UI (`src/components/ui`)
- **State Management**: Zustand (Client State) + TanStack Query v5 (Server State)
- **API Client**: Orval (REST API hooks 自動生成) + Axios
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### **アーキテクチャパターン**

#### **1. 階層化されたデータフェッチング & ロジック**
- **API Layer**: `src/api/generated` (Orval生成フック)
  - `useDashboardStatisticsControllerGetAllV1` などの直接的なAPIフック
- **Service/Manager Layer**: カスタムフック (例: `useCustomDashboardsApi.ts`, `useDashboardManager.ts`)
  - APIレスポンスのDTO変換 (Anti-Corruption Layer)
  - ビジネスロジックの集約
  - Store と API の連携
- **UI Layer**: Components + Pages
  - Managerフックを使用してデータとロジックにアクセス
  - 直接APIフックを呼ぶことは避ける

#### **2. 状態管理の使い分け**
- **Server State**: React Query (Orval生成フック経由)
  - キャッシュ、ローディング状態、再取得を管理
- **Client Global State**: Zustand (`src/store` or feature specific stores)
  - `useDashboardStore.ts` など、UIの状態（編集中フラグ、選択中のIDなど）を管理
  - `devtools` ミドルウェアの使用を推奨

#### **3. コンポーネント設計**
- **Feature-based Directory**: `src/components/graph-components/features/...`
  - 機能ごとにコンポーネントをグループ化
- **UI Components**: `src/components/ui` (Shadcn UI)
  - 基本的なUIパーツはここからインポート
- **Client Components**: `'use client'` の明示的な使用
  - グラフやインタラクティブなダッシュボード機能が多いため多用される傾向

### **命名規則とディレクトリ構造**
- **Page**: `src/app/(authenticated)/.../page.tsx`
- **Feature Components**: `src/components/graph-components/features/<feature-name>/`
- **Stores**: `src/stores/` または `<feature>/stores/`
- **API Hooks**: `src/api/generated.ts` (自動生成)

## レビュー観点

以下の観点から体系的にレビューを行ってください:

### 1. 🎯 **機能性とロジック**
- **要件の充足**: 変更が意図した機能要件を満たしているか
- **ロジックの正確性**: アルゴリズムやビジネスロジックが正しく実装されているか
- **エッジケースの処理**: 境界値、null/undefined、空配列/オブジェクトなどが適切に処理されているか
- **エラーハンドリング**: try-catch、エラー境界、fallbackが適切に実装されているか

### 2. 🏗️ **アーキテクチャと設計パターン**
- **レイヤードアーキテクチャの遵守**:
  - UI層（Components）から直接 API hooks を呼んでいないか（Manager hooksを使用すべき）
  - Manager hooks がビジネスロジックとストア操作を適切にカプセル化しているか
- **ACL (Anti-Corruption Layer)**: APIレスポンスが適切にフロントエンド型に変換されているか
- **責務の分離**: コンポーネント、Managerフック、生成されたAPIフックの責務が明確か
- **再利用性**: 共通コンポーネントが `src/components/ui` や `src/components/graph-components` に適切に配置されているか
- **データフロー**: Store（Zustand）と Server State（React Query）の使い分けが適切か

### 3. 📖 **可読性と保守性**
- **命名規則**: 変数名、関数名、型名が意図を明確に表現しているか
- **ディレクトリ構造**: 機能ベースのディレクトリ構造 (`features/<feature-name>`) に従っているか
- **カスタムフック**: 複雑なロジックが `hooks/` または `components/.../hooks/` に抽出されているか
- **コードの複雑度**: コンポーネントが肥大化していないか（必要に応じてサブコンポーネントに分割）
- **重複コードの排除**: DRY原則に従い、共通ロジックが適切に共有されているか
- **マジックナンバー**: 定数が適切に名前付け・管理されているか

### 4. 🔒 **セキュリティ**
- **入力の検証とサニタイゼーション**: XSS、インジェクション攻撃への対策
- **認証・認可**: 適切なアクセス制御が実装されているか
- **機密情報の取り扱い**: ハードコードされた認証情報、トークンがないか
- **依存関係の脆弱性**: 新たに追加されたライブラリに既知の脆弱性がないか
- **データの暴露**: console.logなどで機密情報が出力されていないか

### 5. ⚡ **パフォーマンス**
- **レンダリングの最適化**: React.memo、useMemo、useCallbackが適切に使用されているか
- **不要な再レンダリング**: 依存配列の設定が適切か
- **データ取得の効率性**: N+1問題、過度なAPI呼び出しがないか
- **バンドルサイズ**: 大きなライブラリの動的インポート(lazy loading)が考慮されているか
- **メモリリーク**: useEffectのクリーンアップが適切か

### 6. ✅ **テストカバレッジと品質**
- **テストの存在**: 重要な機能に対するテストが書かれているか
- **テストケースの網羅性**: 正常系、異常系、エッジケースがカバーされているか
- **テストの可読性**: テストコードが理解しやすく、保守しやすいか
- **モックの適切さ**: 依存関係のモックが適切に設定されているか
- **テストの独立性**: 各テストが独立して実行可能か

### 7. 🎨 **コードスタイルと一貫性**
- **Shadcn UI の活用**: 既存のUIコンポーネント (`src/components/ui`) を再利用しているか
- **Tailwind CSS**:
  - Arbitrary values (`w-[123px]`など) を避け、定義済みトークンを使用
  - クラス順序整理に `clsx` / `tailwind-merge` を使用
- **コーディング規約**: ESLint/Prettier に従っているか
- **インポート順序**: 一貫したインポート順序
- **ファイル構造**: `page.tsx`、`layout.tsx`、`components` の配置が Next.js 慣習に従う

### 8. 📚 **ドキュメント**
- **JSDoc/TSDoc**: パブリックAPI、複雑な関数に適切なドキュメント
- **README更新**: 機能追加時の更新
- **型定義ドキュメント**: 複雑型の説明
- **コードコメント**: 設計判断や技術的負債の記録

### 9. 🔄 **型安全性と依存関係**
- **型の整合性**: props/APIレスポンスの型が正確か
- **nullチェック**: Optional Chaining / nullish coalescing
- **未使用コードの除去**: 不要 import/変数/関数なし
- **型のエクスポート**: 再利用型は適切に export

### 10. 📦 **Next.js 16 & プロジェクト固有の観点**
- **Server vs Client Components**:
  - `'use client'` は必要な箇所のみ
  - data fetching は Server Components/React Query 優先
- **Routing**: `src/app` の構成が適切
- **Orval / API Hooks**:
  - 自動生成フックを直接修正しない
  - 仕様変更が必要なら OpenAPI 更新を提案
- **Zustand Stores**:
  - Store の粒度は適切か
  - `devtools` 使用
- **Recharts**:
  - `ResponsiveContainer` 等でレスポンシブ対応
- **パフォーマンス**:
  - `next/image`, `next/link` を適切に使用

### 11. 💼 **ビジネスコンテキスト**
- **要件との整合性**: 仕様と実装の一致
- **ユーザー体験**: UX の劣化がないか
- **アクセシビリティ**: Shadcn UI の a11y を損なっていないか

## レビュープロセス

以下の手順でレビューを進めてください:

### ステップ1: ブランチ情報の収集
```bash
# 現在のブランチ名を取得
git branch --show-current

# マージ元のブランチとの差分ファイル一覧
git diff <base-branch>...HEAD --name-status

# 最近のコミット履歴
git log <base-branch>..HEAD --oneline

# 変更の統計
git diff <base-branch>...HEAD --stat
```

### ステップ2: 変更内容の理解
- コミットメッセージから変更意図を把握
- 変更ファイル数と規模を確認
- 変更が小さく焦点が絞られているか評価 (推奨 200-400行以内)

### ステップ3: コード分析
#### 3.1 アーキテクチャレベル
- Serena MCP で依存関係を分析
- 既存パターンとの整合性
- 新規追加コンポーネントの設計妥当性

#### 3.2 詳細レベル
- 各ファイルを開いて詳細を確認
- 10 観点で評価
- 自動チェックでは見つからない問題を探す

### ステップ4: テストとビルドの確認
```bash
# ビルドが成功するか確認
npm run build

# テストが通るか確認
npm run test

# 型チェック
npm run type-check
```

### ステップ5: レビュー結果の報告
以下の構造で報告:

```markdown
## コードレビュー完了

### ✅ 実装の評価
[変更内容のサマリー]

### 📊 変更の概要
- **ブランチ名**: `<branch-name>`
- **マージ先**: `<base-branch>`
- **変更ファイル数**: X ファイル
- **追加行数**: +X 行
- **削除行数**: -X 行
- **コミット数**: X コミット

### 🎯 主な変更点
[主要な変更内容を3-5個にまとめる]

### ✅ 良い点
[以下の観点で評価]
1. **アーキテクチャ**: [評価とコメント]
2. **コードの品質**: [評価とコメント]
3. **型安全性**: [評価とコメント]
4. **保守性**: [評価とコメント]

### ⚠️ 改善が推奨される点
[見つかった問題を重要度順に列挙]

#### 🔴 Critical (即座に修正すべき)
- [セキュリティ/機能不全/データ損失のリスク]

#### 🟡 Important (修正を強く推奨)
- [バグ/性能問題/保守性低下]

#### 🟢 Nice to Have (改善提案)
- [リファクタ/より良い実装]

### 💡 改善提案の詳細
[各問題について以下を含める]
- **問題点**: 何が問題か
- **なぜ問題か**: 影響
- **推奨される修正方法**: 具体案
- **代替案** (あれば)

### 📈 総合評価

| 項目 | 評価 | コメント |
|------|------|----------|
| アーキテクチャ整合性 | ⭐⭐⭐⭐⭐ | [コメント] |
| コードの一貫性 | ⭐⭐⭐⭐⭐ | [コメント] |
| 型安全性 | ⭐⭐⭐⭐⭐ | [コメント] |
| テストカバレッジ | ⭐⭐⭐⭐⭐ | [コメント] |
| セキュリティ | ⭐⭐⭐⭐⭐ | [コメント] |
| パフォーマンス | ⭐⭐⭐⭐⭐ | [コメント] |

### 🎉 結論
**[マージ可否の判断]**

- ✅ **Approve**: 優れた実装でそのままマージ可能
- ⚠️ **Approve with suggestions**: 軽微な改善提案
- 🔄 **Request changes**: 修正が必要
- ❌ **Block**: 重大な問題があり修正必須

[最終的な推奨アクションと理由]
```

## 特記事項

### Serena MCP活用のガイドライン
以下のケースでは積極的に Serena MCP を使用してください:
- Controller → UseCase → Domain/Repository の関係確認
- 特定の Domain Model/Repository の利用箇所調査
- スキーマ変更の影響範囲調査
- レイヤー間依存関係の正当性確認

### レビューの心構え
- **建設的であること**: 改善提案を行う
- **具体的であること**: なぜ/どう改善を示す
- **学びの機会として**: チームのスキル向上を意識
- **文脈を考慮**: 技術的負債/締め切り/段階的改善
- **自動化可能なものは自動化**: linter/formatter で検出できるものは指摘しない
