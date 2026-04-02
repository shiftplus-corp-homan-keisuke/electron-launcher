# OpenCode 実践ガイド
# OpenCode Practical Guide

**具体的なシナリオに基づくステップバイステップガイド**
**Step-by-step guide based on real scenarios**

---

## 目次 / Table of Contents

1. [シナリオ1: 新しいブログサイトを作成](#シナリオ1-新しいブログサイトを作成)
2. [シナリオ2: 認証機能を追加](#シナリオ2-認証機能を追加)
3. [シナリオ3: APIエラーをデバッグ](#シナリオ3-apiエラーをデバッグ)
4. [シナリオ4: パフォーマンスを最適化](#シナリオ4-パフォーマンスを最適化)
5. [シナリオ5: 本番環境にデプロイ](#シナリオ5-本番環境にデプロイ)

---

## シナリオ1: 新しいブログサイトを作成

### 目標 / Goal
Next.js 14 + TypeScript + Tailwind CSS でブログサイトを作成する

Create a blog site with Next.js 14 + TypeScript + Tailwind CSS

### ステップ 1: 計画を作成

```
/plan Next.jsブログサイト
Markdown対応で
記事一覧と詳細ページ
```

**期待される出力 / Expected Output**:
```markdown
✅ Plan created: ./specs/nextjs-blog/nextjs-blog-plan.md
✅ Task list created: ./specs/nextjs-blog/nextjs-blog-task.md

Next steps:
- Review the plan
- Run /create to start implementation
```

**計画ファイルの内容 / Plan File Contents**:
- Tech Stack: Next.js 14, TypeScript, Tailwind
- Features: 記事一覧, 記事詳細, Markdown対応
- Task breakdown with phases

### ステップ 2: アプリケーションを作成

```
/create Next.jsブログサイト
```

**実行される内容 / What Happens**:

1. **要件確認 / Requirements Gathering**:
   ```
   質問 / Questions:
   - データベースは必要ですか？→ No (Markdown files)
   - 認証は必要ですか？→ No (public blog)
   - コメント機能は？→ No (MVP)
   ```

2. **プロジェクト作成 / Project Creation**:
   ```
   ✅ Creating Next.js 14 project
   ✅ Configuring TypeScript
   ✅ Setting up Tailwind CSS
   ✅ Creating file structure
   ```

3. **実装 / Implementation**:
   - `app/layout.tsx` - Root layout
   - `app/page.tsx` - Home page (記事一覧)
   - `app/posts/[slug]/page.tsx` - 記事詳細
   - `lib/markdown.ts` - Markdown処理
   - `components/BlogCard.tsx` - ブログカード

4. **プレビュー起動 / Preview Start**:
   ```
   🚀 Starting preview...
   ✅ Preview ready!
   URL: http://localhost:3000
   ```

### ステップ 3: 記事を追加

```
@frontend-specialist
サンプル記事を3つ作成して
Markdown形式で
```

**作成されるファイル / Files Created**:
- `app/posts/first-post.md`
- `app/posts/second-post.md`
- `app/posts/third-post.md`

### ステップ 4: スタイリング調整

```
@frontend-specialist
ブログカードのスタイルを調整して
ホバーエフェクトと影を追加
Tailwind CSSを使用
```

**変更されるファイル / Files Modified**:
- `components/BlogCard.tsx`
  - `hover:scale-105` クラス追加
  - `shadow-lg` クラス追加
  - `transition-all` クラス追加

### ステップ 5: テスト

```
/test
```

**実行される内容 / What Happens**:
```
🧪 Running tests...

✅ blog-card.test.tsx (3 passed)
✅ markdown.test.ts (2 passed)
✅ page.test.tsx (1 passed)

Total: 6 tests (6 passed)
```

### ステップ 6: 本番ビルド確認

```
/deploy check
```

**チェック項目 / Checks**:
```markdown
## 🚀 Pre-Deploy Checklist

### Code Quality
- ✅ No TypeScript errors
- ✅ ESLint passing
- ✅ All tests passing

### Security
- ✅ No hardcoded secrets
- ✅ Dependencies audited

### Performance
- ✅ Bundle size acceptable
- ✅ Images optimized

Ready to deploy? (y/n)
```

---

## シナリオ2: 認証機能を追加

### 目標 / Goal
既存のアプリにNextAuth.jsを使った認証を追加する

Add authentication to existing app using NextAuth.js

### ステップ 1: 現状分析

```
@backend-specialist
現在のアプリ構造を分析して
認証機能を追加するための計画を立てて
```

**分析結果 / Analysis**:
```markdown
## Current State
- Framework: Next.js 14
- Database: None (needs to add)
- Current routes: /, /about, /contact

## Authentication Plan
- Provider: NextAuth.js
- Database: SQLite for development
- Strategy: Email + Password
```

### ステップ 2: データベース設計

```
@database-architect
認証用のデータベーススキーマ設計して
SQLite使用
ユーザーテーブルとセッション管理
```

**作成されるスキーマ / Schema Created**:
```sql
-- prisma/schema.prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  sessions      Session[]
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  expires      DateTime
  sessionToken String   @unique
  user         User     @relation(fields: [userId], references: [id])
}
```

### ステップ 3: 認証API実装

```
@backend-specialist
NextAuth.jsのAPIルートを実装して
サインアップ、サインイン、サインアウト
```

**作成されるファイル / Files Created**:
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/signup/route.ts`
- `lib/auth.ts`
- `lib/prisma.ts`

### ステップ 4: フロントエンド実装

```
@frontend-specialist
ログインページとサインアップページを作成して
フォームバリデーション付き
```

**作成されるファイル / Files Created**:
- `app/signin/page.tsx`
- `app/signup/page.tsx`
- `components/AuthForm.tsx`
- `app/layout.tsx` (更新 - SessionProvider追加)

### ステップ 5: 保護されたページ

```
@frontend-specialist
ダッシュボードページを作成して
認証済みユーザーのみアクセス可能
```

**作成されるファイル / Files Created**:
- `app/dashboard/page.tsx`
- `middleware.ts` (認証チェック)

**middleware.ts の実装**:
```typescript
export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*"]
}
```

### ステップ 6: テスト

```
/test src/app/api/auth/
```

**テストケース / Test Cases**:
- ✅ サインアップ成功
- ✅ サインイン成功
- ✅ 無効な認証情報で失敗
- ✅ セッション管理

### ステップ 7: セキュリティ監査

```
@security-auditor
認証システムのセキュリティを監査して
脆弱性をチェック
```

**チェック項目 / Audit Checks**:
```markdown
## Security Review

✅ Password hashing (bcrypt)
✅ Session token security
✅ CSRF protection
✅ SQL injection prevention
⚠️  Rate limiting needed
```

---

## シナリオ3: APIエラーをデバッグ

### 目標 / Goal
APIが500エラーを返す問題を解決する

Fix API returning 500 error

### ステップ 1: エラー情報収集

```
/debug /api/users returns 500 error
```

**収集される情報 / Information Gathered**:
```markdown
## 1. Symptom
GET /api/users → 500 Internal Server Error

## 2. Information Gathered
- Error: "Cannot read property 'map' of undefined"
- File: src/app/api/users/route.ts
- Line: 15
- Recent changes: Database query modified
```

### ステップ 2: 仮説立案

**デバッガーの仮説 / Debugger's Hypotheses**:
```markdown
## 3. Hypotheses
1. ❓ Database query returning null instead of array
2. ❓ Async/await issue in route handler
3. ❓ Missing error handling
```

### ステップ 3: 仮説テスト

```
@backend-specialist
仮説1を検証：
データベースクエリがnullを返していないか確認して
```

**検証結果 / Investigation Results**:
```markdown
## 4. Investigation

**Testing hypothesis 1:**
- Checked prisma.user.findMany()
- Result: Returns [] when empty, NOT null
- Status: ❌ Hypothesis rejected

**Testing hypothesis 2:**
- Reviewed async/await in route.ts
- Found: missing await on prisma query
- Status: ✅ Root cause found
```

### ステップ 4: 修正適用

```
@backend-specialist
問題を修正して
適切なエラーハンドリングも追加
```

**修正前 / Before**:
```typescript
export async function GET() {
  const users = prisma.user.findMany()  // ❌ Missing await
  return Response.json(users)
}
```

**修正後 / After**:
```typescript
export async function GET() {
  try {
    const users = await prisma.user.findMany()  // ✅ Added await
    return Response.json(users)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
```

### ステップ 5: 回帰テスト

```
/test src/app/api/users/route.test.ts
```

**テスト結果 / Test Results**:
```
✅ GET /api/users returns 200
✅ Returns empty array when no users
✅ Returns users array when data exists
✅ Error handling works
```

### ステップ 6: 予防策

**追加される予防策 / Prevention Measures Added**:
```typescript
// lib/api-error-handler.ts
export function handleApiError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
  }
  // Generic error handler
}
```

---

## シナリオ4: パフォーマンスを最適化

### 目標 / Goal
ページの読み込みが遅い問題を解決する

Fix slow page load times

### ステップ 1: 現状測定

```
@performance-optimizer
ページロードが遅い原因を分析して
Lighthouse実行
```

**分析結果 / Analysis Results**:
```markdown
## Performance Issues Found

🔴 CRITICAL:
- LCP: 4.2s (target: <2.5s)
- TTI: 6.1s (target: <3.5s)
- Bundle size: 850KB (target: <200KB)

🟡 HIGH:
- Unoptimized images
- Waterfall in data fetching
- Client-side rendering of static content
```

### ステップ 2: 最適化計画

```
@performance-optimizer
最適化プランを作成して
優先順位付きで
```

**最適化プラン / Optimization Plan**:
```markdown
## Phase 1: Critical (Immediate)
1. Implement dynamic imports for components
2. Add image optimization
3. Convert to SSR for static content

## Phase 2: High Priority
1. Implement data fetching optimizations
2. Add route prefetching
3. Optimize bundle size
```

### ステップ 3: 実装 - フェーズ1

```
@frontend-specialist
動的インポートを実装して
重いコンポーネントをlazy loading
```

**実装 / Implementation**:
```typescript
// Before
import { HeavyChart } from '@/components/HeavyChart'

// After
const HeavyChart = dynamic(
  () => import('@/components/HeavyChart'),
  { loading: () => <ChartSkeleton /> }
)
```

### ステップ 4: 画像最適化

```
@frontend-specialist
全ての画像をnext/imageに置き換えて
最適化を有効化
```

**実装 / Implementation**:
```typescript
// Before
<img src="/hero.jpg" alt="Hero" />

// After
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority
  placeholder="blur"
/>
```

### ステップ 5: SSR実装

```
@frontend-specialist
ブログ一覧ページをSSRに変換して
サーバーサイドレンダリング
```

**実装 / Implementation**:
```typescript
// Before: Client Component
export default function BlogList() {
  const [posts, setPosts] = useState([])
  // Client-side fetching
}

// After: Server Component
export default async function BlogList() {
  const posts = await prisma.post.findMany()
  // Server-side rendering
}
```

### ステップ 6: 再測定

```
@performance-optimizer
最適化後のパフォーマンスを測定して
Lighthouse再実行
```

**改善結果 / Improvement Results**:
```markdown
## Performance Improvements

✅ LCP: 1.8s (was 4.2s) - 57% improvement
✅ TTI: 2.9s (was 6.1s) - 52% improvement
✅ Bundle: 180KB (was 850KB) - 79% reduction
✅ Lighthouse Score: 92 (was 54)
```

---

## シナリオ5: 本番環境にデプロイ

### 目標 / Goal
Vercelに本番デプロイする

Deploy to Vercel production

### ステップ 1: 事前チェック

```
/deploy check
```

**チェック結果 / Check Results**:
```markdown
## ✅ Pre-Deploy: All Checks Passed

### Code Quality
- ✅ No TypeScript errors
- ✅ ESLint passing
- ✅ All tests passing (45/45)

### Security
- ✅ No hardcoded secrets
- ✅ Environment variables documented
- ✅ Dependencies audited

### Performance
- ✅ Bundle size: 180KB
- ✅ No console.log statements
- ✅ Images optimized

### Build
- ✅ npm run build successful
- ✅ Build output optimized
```

### ステップ 2: 環境変数設定

```
@devops-engineer
Vercel用の環境変数を設定して
DATABASE_URLなど
```

**設定される環境変数 / Environment Variables**:
```bash
# .env.production
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://myapp.vercel.app
```

### ステップ 3: Vercelプロジェクト設定

```
@devops-engineer
Vercelプロジェクトを設定して
ドメイン、ビルド設定、環境変数
```

**vercel.json の作成 / Create vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

### ステップ 4: 本番デプロイ実行

```
/deploy production
```

**デプロイプロセス / Deployment Process**:
```markdown
## 🚀 Deploying to Production

### Step 1: Pre-flight Checks
✅ All checks passed

### Step 2: Build
✅ Build completed (45 seconds)

### Step 3: Deploy to Vercel
✅ Deployment successful

### Step 4: Health Check
✅ Application responding (200 OK)
✅ Database connected
✅ All services healthy
```

### ステップ 5: 本番検証

```
@devops-engineer
本番環境のヘルスチェックを実行して
エンドポイントを検証
```

**検証結果 / Verification Results**:
```markdown
## Production Verification

✅ https://myapp.vercel.app - 200 OK
✅ /api/health - 200 OK
✅ Database connection - OK
✅ Auth flow - Working
✅ All routes - Accessible

### Performance
✅ Lighthouse: 94
✅ Uptime: 100%
```

### ステップ 6: モニタリング設定

```
@devops-engineer
Vercel Analyticsとエラー監視を設定して
```

**設定される項目 / Monitoring Setup**:
- Vercel Analytics
- Error tracking (Sentry)
- Uptime monitoring
- Performance monitoring

---

## トラブルシューティング

### 問題: コマンドが実行されない

**解決策**:
```
1. `/` キーを押してコマンドパレットを開く
2. コマンド名を正確に入力
3. Tabキーで補完を使用
```

### 問題: エージェントが応答しない

**解決策**:
```
1. @の後にスペースを入れる
2. エージェント名を確認
3. Tabキーでprimaryエージェントを切り替え
```

### 問題: 予期しない結果

**解決策**:
```
1. /status で現状確認
2. /debug で問題を調査
3. @orchestrator で複雑なタスクを調整
```

---

## ベストプラクティス

### 1. 計画から始める / Start with Planning

```
/plan [task]  →  計画作成
/create      →  実装
```

### 2. エージェントを適切に使う / Use Agents Appropriately

```
@frontend-specialist  →  UI/React/Next.js
@backend-specialist   →  API/バックエンド
@database-architect   →  データベース
@orchestrator         →  複雑なマルチドメインタスク
```

### 3. テストを忘れない / Don't Forget Testing

```
実装後は必ず /test
デプロイ前に /test coverage
```

### 4. デプロイ前チェック / Pre-Deploy Checks

```
/deploy check  →  事前検証
/deploy        →  デプロイ実行
```

---

## まとめ / Summary

このガイドでは、以下の実践的なシナリオをカバーしました：

This guide covered these practical scenarios:

1. ✅ 新しいアプリケーションの作成 / Creating new applications
2. ✅ 機能追加（認証など）/ Adding features (e.g., authentication)
3. ✅ デバッグ手法 / Debugging techniques
4. ✅ パフォーマンス最適化 / Performance optimization
5. ✅ 本番デプロイ / Production deployment

**次のステップ / Next Steps**:

- 自分のプロジェクトで試す / Try with your own projects
- USER_GUIDE.md で詳細を学ぶ / Learn more in USER_GUIDE.md
- より複雑なシナリオに挑戦 / Tackle more complex scenarios

---

**詳細情報 / More Information**:
- **USER_GUIDE.md** - 詳細な使い方マニュアル
- **QUICK_REFERENCE.md** - クイックチートシート

---

**バージョン**: 1.0 | **更新**: 2026-01-31
