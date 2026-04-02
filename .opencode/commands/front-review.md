---
description: 現在のブランチのコードレビューを実施 (Angular front)
---

# コードレビューワークフロー (Angular)

現在のブランチで行われた変更の包括的なコードレビューを実施します。

## プロジェクト固有のアーキテクチャ

このプロジェクトでは以下のアーキテクチャ・技術スタックを採用しています:

### **コアアーキテクチャ**
- **Angular 18.x** + Standalone Components (一部 NgModule との混在)
- **TypeScript strict mode 有効**: `strict: true`、`strictTemplates: true`
- **状態管理**: UseCase + State パターン (Angular Signals ベース)
  - UseCase: `*.use-case.ts` - ビジネスロジック、API呼び出し、State の更新
  - State: `*.state.ts` - Angular Signal を使用した状態クラス (`SignalState` インターフェース)
  - **[レガシー]** 一部で `@ngneat/elf` + Repository パターン (`*.repository.ts`) も残存
- **コンポーネント設計**: Container/Presentational パターン
  - Container: `*.container.ts` - UseCase の呼び出し、ビジネスロジック
  - Presentational: `*.presentational.ts` - 純粋なUI表示、Signal-based inputs
- **DI方式**: `inject()` 関数を使用 (`providedIn: 'root'` が標準)
- **Change Detection**: `ChangeDetectionStrategy.OnPush` 戦略
- **Inputs**: Signal-based inputs (`input()`, `input.required<T>()`)

### **共通インフラストラクチャ**
- **HTTP Interceptor**: `TokenInterceptor` - 認証トークン付与、エラーハンドリング
  - `HttpContextToken` パターン: `LoadingContextToken`、`SkipAlertContextToken`
- **Guards**: 4個 (`auth.guard.ts`, `user-role.guard.ts`, `mfa-input.guard.ts`, `survey-analysis.guard.ts`)
- **Pipes**: 28個以上（`user-role.pipe.ts`, `bytes.pipe.ts`, `md-to-html.pipe.ts` など）
- **Directives**: 5個 (`tooltip.directive.ts`, `click-outside.directive.ts`, `clipboard.directive.ts` など)
- **共通Services**: `NotificationService`, `LoadingSpinnerOverlayService` など

### **命名規則とディレクトリ構造**
- **ファイル命名**: `<feature>.<type>.ts` (例: `user-profile.container.ts`, `prompt-example.use-case.ts`)
- **ディレクトリ構造**: `src/app/<module>/<feature>/<type>/` (例: `src/app/chat/prompt-example/use-case/`)
- **共通コンポーネント**: `src/common/` に集約

### **テスト**
- 現時点でテストファイル (`.spec.ts`) は存在しない

## レビュー観点

以下の観点から体系的にレビューを行ってください:

### 1. 🎯 **機能性とロジック**
- **要件の充足**: 変更が意図した機能要件を満たしているか
- **ロジックの正確性**: アルゴリズムやビジネスロジックが正しく実装されているか
- **エッジケースの処理**: 境界値、null/undefined、空配列/オブジェクトなどが適切に処理されているか
- **エラーハンドリング**: try-catch、RxJS catchError、ErrorHandlerが適切に実装されているか

### 2. 🏗️ **アーキテクチャと設計パターン**
- **Container/Presentationalパターン**:
  - Container (`*.container.ts`) はビジネスロジックと UseCase 呼び出しのみを担当しているか
  - Presentational (`*.presentational.ts`) は純粋な表示ロジックのみで、DIを持たないか
  - Presentational は `input()` / `input.required()` でデータを受け取っているか
- **UseCase + State パターン** (推奨):
  - UseCase (`*.use-case.ts`) はビジネスロジックと API 呼び出しを担当しているか
  - State (`*.state.ts`) は Angular Signals を使用し、`SignalState` インターフェースを実装しているか
  - State は `asReadonly()` メソッドで読み取り専用の状態を公開しているか
  - UseCase がプライベートフィールド (`#state`) で State を保持し、`state` で外部に公開しているか
- **[レガシー] Repository パターン** (`@ngneat/elf`): 新規開発では UseCase + State パターンを使用してください
- **SOLID原則**: 単一責任、開放閉鎖、依存性逆転などの原則が守られているか
- **責務の分離**: Container → UseCase → API Service の層構造が守られているか
- **アーキテクチャ・ドリフト**: 新しいコードが既存のアーキテクチャから逸脱していないか
- **DI設計**: `inject()` 関数が一貫して使用されているか、`providedIn: 'root'` が適切か

### 3. 📖 **可読性と保守性**
- **命名規則**: 変数名、関数名、型名が意図を明確に表現しているか
- **ファイル命名規則**: `<feature>.<type>.ts` パターンに従っているか
  - Container: `*.container.ts`
  - Presentational: `*.presentational.ts`
  - UseCase: `*.use-case.ts`
  - State: `*.state.ts`
  - Service: `*.service.ts`
- **ディレクトリ構造**: `src/app/<module>/<feature>/<type>/` パターンに従っているか
- **コードの複雑度**: 関数やコンポーネントが適切なサイズに保たれているか(1関数50行以下推奨)
- **コメントの質**: 複雑なロジックに適切な説明があるか(why、不明瞭なwhat)
- **重複コードの排除**: DRY原則に従い、不要な重複がないか
- **マジックナンバー**: 定数が適切に名前付けされているか

### 4. 🔒 **セキュリティ**
- **入力の検証とサニタイゼーション**: XSS、インジェクション攻撃への対策
- **認証・認可**: 適切なアクセス制御が実装されているか
- **機密情報の取り扱い**: ハードコードされた認証情報、トークンがないか
- **依存関係の脆弱性**: 新たに追加されたライブラリに既知の脆弱性がないか
- **データの暴露**: console.logなどで機密情報が出力されていないか
- **DomSanitizer**: 信頼されないHTMLの処理が適切か

### 5. ⚡ **パフォーマンス**
- **Change Detection最適化**: `ChangeDetectionStrategy.OnPush` が設定されているか
- **Zone.js の最適化**: `runOutsideAngular` が必要な処理に適用されているか
- **RxJS最適化**: `shareReplay`、`distinctUntilChanged`、`debounceTime` などが適切に使用されているか
- **Signal 最適化**: `computed()` で派生状態を効率的に計算しているか
- **不要な再レンダリング**: `trackBy` の設定、純粋パイプの使用が適切か
- **データ取得の効率性**: N+1問題、過度なAPI呼び出しがないか
- **遅延ロード**: lazy loading が考慮されているか
- **メモリリーク**: Subscription の unsubscribe、takeUntil パターンが適切か

### 6. 🎨 **コードスタイルと一貫性**
- **コーディング規約の順守**: ESLint、Angular Style Guideの設定に従っているか
- **型定義の適切さ**: TypeScript strict mode に準拠しているか
  - `any` の使用を避ける
  - `strict: true` により null/undefined チェックが厳格
  - `noImplicitReturns: true` により全コードパスで返り値を返す
- **インポート順序**: 一貫したインポート順序が保たれているか
  - Angular core imports → サードパーティ → プロジェクト内部
- **ファイル構造**: コンポーネント、サービス、モデルなどの配置が規約に従っているか
- **Standalone vs Module**: 既存パターンとの一貫性が保たれているか
- **共通機能の活用**: `src/common/` の既存Pipe/Directive/Serviceを重複実装していないか

### 7. 📚 **ドキュメント**
- **JSDoc/TSDoc**: パブリックAPI、複雑な関数に適切なドキュメントがあるか
- **README更新**: 機能追加時に必要なドキュメント更新がされているか
- **型定義のドキュメント**: 複雑な型やインターフェースに説明があるか
- **コードコメント**: 設計判断の理由や技術的負債の記録があるか

### 8. 🔄 **型安全性と依存関係**
- **型の整合性**: `input()` / `input.required()` の型、APIレスポンスの型が正確に定義されているか
- **nullチェック**: Optional Chainingやnullish coalescingが適切に使用されているか
- **未使用コードの除去**: 削除忘れのimport、変数、関数がないか
- **型のエクスポート**: 再利用される型が適切にエクスポートされているか
- **strictモード準拠**: Angular strictモードの設定に従っているか

### 9. 💼 **ビジネスコンテキスト**
- **要件との整合性**: ビジネス要件と実装が一致しているか
- **ユーザー体験**: UIの変更がユーザビリティを損なっていないか
- **アクセシビリティ**: ARIA属性、キーボード操作、スクリーンリーダー対応が考慮されているか

### 10. 📦 **Angular 18 & プロジェクト固有の観点**
- **ライフサイクルフック**: `ngOnInit`、`ngOnDestroy`、`ngOnChanges` などが適切に使用されているか
- **テンプレート構文**: `*ngIf`、`*ngFor`、`ngClass` または `@if`、`@for` 構文が正しく使用されているか
- **フォーム**: ReactiveFormsが一貫して使用されているか
- **バリデーション**: フォームバリデーションが適切に実装されているか
- **Standalone Components**: `standalone: true` と `imports` 配列が適切に設定されているか
- **Signal-based APIs**: `input()`, `output()`, `computed()`, `effect()` が適切に使用されているか
- **HttpContextToken の適切な使用**:
  - ローディング表示: `httpContext.set(LoadingContextToken, true/false)`
  - エラーアラート制御: `httpContext.set(SkipAlertContextToken, true/false)`
- **共通Guards の活用**: `auth.guard.ts`, `user-role.guard.ts` などが適切に使用されているか
- **共通Pipes の活用**: 既存の28個以上のPipeを重複実装していないか

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
- 変更が小さく、焦点が絞られているか評価(推奨: 200-400行以内)

### ステップ3: コード分析
#### 3.1 アーキテクチャレベルの確認
- Serena MCPを使用して、コンポーネント間の依存関係を分析
- 既存のアーキテクチャパターンとの整合性をチェック
- 新規追加されたコンポーネントの設計妥当性を評価

#### 3.2 詳細レベルの確認
- 各ファイルを開いて実装の詳細を確認
- 上記の10の観点に基づいて評価
- 自動チェック(linter, formatter)で検出できない問題に注目

### ステップ4: テストとビルドの確認
```bash
# front ディレクトリに移動
cd front

# ビルドが成功するか確認
npm run build

# テストが通るか確認
npm run test

# 型チェック（存在する場合）
npm run type-check
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
4. **保守性**: [評価とコメント]

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
| 保守性 | ⭐⭐⭐⭐☆ | [コメント] |
| パフォーマンス | ⭐⭐⭐⭐⭐ | [コメント] |
| Angular固有の品質 | ⭐⭐⭐⭐⭐ | [コメント] |

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
- コンポーネント間の依存関係を把握する必要がある場合
- 特定のサービスやクラスがどこで使われているか調査する場合
- アーキテクチャパターンの実装箇所を探索する場合
- 大規模なリファクタリングの影響範囲を調査する場合

### レビューの心構え
- **建設的であること**: 批判ではなく、改善のための提案を
- **具体的であること**: 「悪い」ではなく「なぜ、どう改善すべきか」を
- **学びの機会として**: レビューを通じてチーム全体のスキル向上を
- **文脈を考慮**: 技術的負債、締め切り、段階的改善の観点も考慮
- **自動化可能なものは自動化**: linter/formatterで検出できるものは指摘しない
