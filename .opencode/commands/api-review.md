---
description: バックエンドAPIのコードレビューを実施
---

# コードレビューワークフロー (バックエンド API)

現在のブランチで行われた変更の包括的なコードレビューを実施します。

## プロジェクト固有のアーキテクチャ

このプロジェクト (`/api`) では以下のアーキテクチャ・技術スタックを採用しています:

### **コア技術スタック**
- **Framework**: NestJS 11 (TypeScript ベース)
- **Database**: MongoDB + Mongoose 8
- **Authentication**: Passport (JWT Strategy)
- **Validation**: class-validator + class-transformer
- **API Documentation**: Swagger (`@nestjs/swagger`)
- **Logging**: Pino (nestjs-pino)
- **Testing**: Jest + Supertest
- **TypeScript**: strict mode 有効

### **アーキテクチャパターン**

#### **1. レイヤードアーキテクチャ (Clean Architecture 風)**
```
Controller Layer (API エンドポイント)
    ↓
UseCase Layer (ビジネスロジック)
    ↓
Domain Layer (ドメインモデル・サービス)
    ↓
Repository Layer (データ永続化)
```

- **Controller** (`*.controller.ts`): HTTP リクエスト/レスポンス処理、DTO Validation
  - 例: `src/public/channel/controller/channel.public.controller.ts`
- **UseCase** (`*.use-case.ts`): ビジネスロジック、複数 Domain/Repository の組み合わせ
  - 例: `src/public/channel/use-case/create-channel/create-channel.use-case.ts`
- **Domain** (`src/domain/<entity>/`): ドメインモデル、ドメインサービス
  - 例: `src/domain/channel/channel.ts`, `channel.service.ts`
- **Repository** (`src/repository/<entity>/`): Mongoose Schema、データアクセス抽象化
  - 例: `src/repository/channel/channel.repository.ts`, `channel.schema.ts`

#### **2. モジュール構成**
- **Feature Module**: 機能ごとにモジュール化 (`*.module.ts`)
- **API Scope**: 
  - `src/public/`: システム外に公開している API
  - `src/admin/`: 一般ユーザー、管理者向け API
  - `src/shiftplus/`: 特定サービス向け API
  - `src/statistics/`: 統計・分析 API
  - `src/survey/`: アンケート機能 API

#### **3. DTOパターン**
- **Request DTO**: バリデーション付き入力データ
  - Path Params: `*-request-path-param.dto.ts`
  - Query Params: `*-query-params.dto.ts`
  - Body: `*-request-body.dto.ts`
- **Response DTO**: API レスポンス型定義
  - `*-response.dto.ts`

#### **4. RepositoryとQueryの責務分離 (CQRS)**
- **Repository** (`*.repository.ts`):
  - **主な責務**: データの永続化（Create/Update/Delete）。
  - **整合性**: ドメインの整合性を守る役割。
  - **Read Preference**: Primary (書き込み一貫性重視)。
- **Query Service** (`*.query.ts`):
  - **主な責務**: 複雑な検索、一覧取得、単一エンティティ/集約の取得、統計データ集計などの参照専用処理（Read）。
  - **柔軟性**: 必要なデータ構造（DTOなど）を自由に射影（Projection）して返すことができる。
  - **Read Preference**: Secondary Preferred（参照負荷の分散）。

### **命名規則とディレクトリ構造**
- **Controller**: `<feature>.<scope>.controller.ts` (例: `channel.public.controller.ts`)
- **UseCase**: `<action>.use-case.ts` (例: `create-channel.use-case.ts`)
- **Domain**: `<entity>.ts`, `<entity>.service.ts`
- **Repository**: `<entity>.repository.ts`, `<entity>.schema.ts`, `<entity>.query.ts`
- **Module**: `<feature>.<scope>.module.ts`

### **セキュリティとガード**
- **JWT Authentication**: `@UseGuards(JwtAuthGuard)`
- **Role-based Authorization**: カスタムガード実装
- **IP Restriction**: `IpGuard`
- **Rate Limiting**: `ThrottlerGuard`

### **テスト**
- **Unit Test**: `*.spec.ts` (Domain, Service)
- **E2E Test**: `test/` ディレクトリ
- **Coverage**: Jest カバレッジレポート

## レビュー観点

以下の観点から体系的にレビューを行ってください:

### 1. 🎯 **機能性とロジック**
- **要件の充足**: 変更が意図した機能要件を満たしているか
- **ビジネスロジックの正確性**: UseCase や Domain Service のロジックが正しく実装されているか
- **エッジケースの処理**: null/undefined、空配列、境界値などが適切に処理されているか
- **エラーハンドリング**: 適切な例外クラスを使用し、エラーメッセージがユーザーフレンドリーか
- **トランザクション管理**: データ整合性が保たれているか (Mongoose セッション使用)

### 2. 🏗️ **アーキテクチャと設計パターン**
- **レイヤー分離の遵守**:
  - Controller が UseCase のみ呼び出し、Repository や Domain を直接呼ばない
  - UseCase が Domain と Repository を組み合わせてビジネスロジックを実装
  - Repository が Mongoose Schema の詳細を隠蔽
- **依存関係の方向**: 外側の層が内側の層に依存 (DIP 原則)
- **単一責任原則**: 各クラスが明確な責務を持っているか
- **ドメインモデルの充実度**: ビジネスルールが Domain 層に集約されているか
- **モジュール分割**: 適切な粒度でモジュールが分割されているか

### 3. 📖 **可読性と保守性**
- **命名規則**: ファイル名、クラス名、メソッド名が規約に従っているか
- **DTO の明確さ**: Request/Response DTO が用途ごとに適切に分離されているか
- **コードの複雑度**: メソッドが適切なサイズに保たれているか (1メソッド30-50行推奨)
- **コメントの質**: 複雑なロジックに `why` を説明するコメントがあるか
- **重複コードの排除**: 共通ロジックが適切に抽出されているか

### 4. 🔒 **セキュリティ**
- **認証・認可**:
  - 適切なガード (`JwtAuthGuard`, `RoleGuard` など) が適用されているか
  - 権限チェックが UseCase または Guard で実装されているか
- **入力検証**:
  - すべての入力に `class-validator` のデコレータが適用されているか
  - SQL/NoSQL インジェクション対策 (Mongoose は基本的に安全だが、raw query に注意)
- **機密情報の取り扱い**:
  - パスワード、トークンがハードコードされていないか
  - ログに機密情報が出力されていないか
- **SSRF 対策**: 外部 URL へのアクセス時に `check-ssrf` 関数を使用しているか
- **依存関係の脆弱性**: 新規追加ライブラリに既知の脆弱性がないか

### 5. ⚡ **パフォーマンス**
- **N+1 クエリ問題**: Mongoose の `populate` が適切に使われているか
- **インデックス設計**: クエリで使用するフィールドにインデックスが定義されているか
- **ページネーション**: 大量データ取得時にページネーションが実装されているか
- **キャッシング**: `@nestjs/cache-manager` の使用が適切か
- **非同期処理**: CPU 負荷の高い処理が非同期化されているか

### 6. ✅ **バリデーションとデータ整合性**
- **Input Validation**:
  - DTO に適切な `class-validator` デコレータが付与されているか
  - カスタムバリデーションが必要な場合、適切に実装されているか
- **Output Validation**: レスポンス DTO が Swagger で適切に定義されているか
- **型安全性**: Repository → Domain の型変換が正しく行われているか
- **Enum の活用**: 固定値が Enum として定義されているか

### 7. 📚 **API 設計と文書化**
- **RESTful 設計**:
  - HTTP メソッド (GET, POST, PUT, DELETE) が適切に使われているか
  - URL パスが REST の規約に従っているか
- **Swagger アノテーション**:
  - `@ApiOperation`, `@ApiResponse`, `@ApiProperty` が適切に付与されているか
  - OpenAPI 仕様が自動生成され、正しく表示されるか
- **エラーレスポンス**: 統一されたエラーレスポンス形式が使われているか
- **バージョニング**: API バージョニング戦略が考慮されているか (必要に応じて)

### 8. 🧪 **テストカバレッジと品質**
- **Unit Test**:
  - Domain, Service, UseCase に対する単体テストが書かれているか
  - 正常系、異常系、エッジケースがカバーされているか
- **E2E Test**: 重要な API エンドポイントに対して E2E テストがあるか
- **テストの可読性**: テストコードが Given-When-Then パターンで記述されているか
- **モックの適切さ**: 外部依存 (Repository, 外部 API) が適切にモックされているか
- **テストの独立性**: 各テストが他のテストに依存せず独立して実行できるか

### 9. 🎨 **コードスタイルと一貫性**
- **ESLint/Prettier**: 設定に従っているか (`npm run lint` が通るか)
- **TypeScript strict mode**: `strict: true` の恩恵を受けているか (型安全性)
- **Dependency Injection**: `@Injectable()` と Constructor Injection が適切に使われているか
- **非同期処理**: `async/await` が一貫して使われているか (Promise チェーンを避ける)
- **インポート順序**: NestJS → サードパーティ → プロジェクト内部 の順序が保たれているか

### 10. 📦 **NestJS & プロジェクト固有の観点**
- **Decorators の正しい使用**:
  - `@Controller()`, `@Get()`, `@Post()` などのルーティングデコレータ
  - `@Body()`, `@Param()`, `@Query()` などのパラメータデコレータ
  - `@UseGuards()`, `@UseInterceptors()` などのミドルウェアデコレータ
- **Mongoose Schema**:
  - Schema 定義が適切か (型、デフォルト値、インデックス)
  - Virtual フィールドや Pre/Post フックが必要に応じて使われているか
- **Module の依存関係**:
  - Circular Dependency がないか
  - `imports`, `providers`, `exports` が適切に設定されているか
- **Logging**:
  - Pino logger が一貫して使われているか
  - ログレベル (info, warn, error) が適切か
- **Environment Variables**: `.env` ファイルの変数が適切に管理されているか

### 11. 💼 **ビジネスコンテキスト**
- **要件との整合性**: ビジネス要件と実装が一致しているか
- **データ移行**: スキーマ変更時にマイグレーションスクリプトが必要か
- **後方互換性**: 既存 API の破壊的変更がないか、バージョニングが適切か
- **パフォーマンス影響**: 本番環境への影響が考慮されているか

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
- コミットメッセージから変更の意図を把握
- 変更されたファイルの数と変更規模を確認
- API 仕様変更の有無を確認 (OpenAPI/Swagger ドキュメント)
- データベーススキーマ変更の有無を確認

### ステップ3: コード分析
#### 3.1 アーキテクチャレベルの確認
- Serena MCP を使用して、レイヤー間の依存関係を分析
- Controller → UseCase → Domain/Repository の流れが正しいか
- 新規 API エンドポイントの設計妥当性を評価

#### 3.2 詳細レベルの確認
- 各ファイルを開いて実装の詳細を確認
- 上記の11の観点に基づいて評価
- 自動チェック (linter, formatter) で検出できない問題に注目

### ステップ4: テストとビルドの確認
```bash
# ビルドが成功するか確認
npm run build

# テストが通るか確認
npm run test

# E2E テストが通るか確認 (必要に応じて)
npm run test:e2e

# Lint チェック
npm run lint
```

### ステップ5: レビュー結果の報告
以下の構造でレビュー結果を報告してください:

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
[主要な変更内容を3-5個のポイントにまとめる]

### ✅ 良い点
[以下の観点で評価]
1. **アーキテクチャ**: [評価とコメント]
2. **コードの品質**: [評価とコメント]
3. **型安全性**: [評価とコメント]
4. **テスト**: [評価とコメント]

### ⚠️ 改善が推奨される点
[見つかった問題を重要度順に列挙]

#### 🔴 Critical (即座に修正すべき)
- [セキュリティ、機能不全、データ損失のリスクがある問題]

#### 🟡 Important (修正を強く推奨)
- [バグ、パフォーマンス問題、保守性の大幅な低下]

#### 🟢 Nice to Have (改善提案)
- [リファクタリング、より良い実装方法の提案]

### 💡 改善提案の詳細
[各問題について、以下を含める]
- **問題点**: 何が問題か
- **なぜ問題か**: ビジネスや技術的な影響
- **推奨される修正方法**: 具体的なコード例や方針
- **代替案** (あれば): 他の解決方法

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

- ✅ **Approve**: 優れた実装で、そのままマージ可能
- ⚠️ **Approve with suggestions**: 軽微な改善提案があるがマージ可能
- 🔄 **Request changes**: 修正が必要
- ❌ **Block**: 重大な問題があり、修正必須

[最終的な推奨アクションと理由]
```

## 特記事項

### Serena MCP活用のガイドライン
以下のケースでは積極的にSerena MCPを使用してください:
- Controller → UseCase → Domain/Repository の呼び出し関係を確認する場合
- 特定の Domain Model や Repository がどこで使われているか調査する場合
- スキーマ変更の影響範囲を調査する場合
- レイヤー間の依存関係が正しいか検証する場合

### レビューの心構え
- **建設的であること**: 批判ではなく、改善のための提案を
- **具体的であること**: 「悪い」ではなく「なぜ、どう改善すべきか」を
- **学びの機会として**: レビューを通じてチーム全体のスキル向上を
- **文脈を考慮**: 技術的負債、締め切り、段階的改善の観点も考慮
- **自動化可能なものは自動化**: linter/formatter で検出できるものは指摘しない

### バックエンド特有の注意点
- **データベーススキーマ変更**: 既存データへの影響、マイグレーション計画を確認
- **API 破壊的変更**: 既存クライアント (フロントエンド) への影響を確認
- **パフォーマンス**: 大量データを扱う API では特に注意
- **セキュリティ**: 認証・認可、入力検証は妥協しない
- **ログ**: 本番環境でのトラブルシューティングに必要な情報が記録されているか
