---
name: docs-generator
description: Automatic documentation generation from source code - API docs, component docs, architecture diagrams
license: MIT
compatibility: opencode
---

# Documentation Generator - 自動ドキュメント生成

> **ドキュメント自動生成スキル** - ソースコードから品質の高いドキュメントを自動生成する

---

## Core Principles

| 原則 | 説明 |
|------|------|
| **抽出重視** | コードから最大限の情報を抽出 |
| **標準準拠** | OpenAPI 3.0、Markdown標準など |
| **增量更新** | 変更分のみを効率的に更新 |
| **統合性** | 既存エージェントとの連携 |

---

## 対応フォーマット

| カテゴリ | フォーマット | 用途 |
|---------|------------|------|
| **API** | OpenAPI 3.0 (JSON/YAML) | Swagger UI、APIツール |
| **API** | Markdown | 人間向けドキュメント |
| **コンポーネント** | Markdown | Props、使用例 |
| **コンポーネント** | Storybook | インタラクティブなストーリー |
| **アーキテクチャ** | Mermaid | 図、フローchart |
| **アーキテクチャ** | ASCII Art | シンプルなツリー図 |

---

## ドキュメント生成ワークフロー

### Phase 1: ソースコード解析

```python
# 1. ファイル検出
patterns = ["src/**/*.{ts,tsx}", "app/api/**/route.ts"]
files = glob_patterns(patterns, exclude="**/*.test.{ts,tsx}")

# 2. パーサー選択
for file in files:
    if file.endswith("route.ts"):
        parser = APIRouteParser()
    elif file.endswith((".tsx", ".jsx")):
        parser = ComponentParser()
    else:
        continue

    # 3. AST解析
    ast = parser.parse(file)
    metadata = parser.extract_metadata(ast)
```

### Phase 2: メタデータ抽出

| 抽出対象 | ソース | 方法 |
|---------|-------|------|
| **エンドポイント** | `export async function GET()` | 関数名、HTTPメソッド |
| **型定義** | TypeScript interfaces | Type解析 |
| **JSDoc** | `/** ... */` コメント | コメント抽出 |
| **Props** | Component interfaces | Props型解析 |
| **依存関係** | `import` 文 | インポートグラフ |

### Phase 3: テンプレートレンダリング

```python
# Jinja2 テンプレートを使用
template = env.get_template("api.md.j2")
output = template.render(
    endpoints=metadata.endpoints,
    types=metadata.types,
    examples=metadata.examples
)

# 出力
write_file("docs/api/endpoints.md", output)
```

---

## パーサー実装ガイド

### APIパーサー (api_parser.py)

**役割**: Next.js APIルートからOpenAPIドキュメントを生成

```python
class APIRouteParser:
    def parse(self, filepath: str) -> APIMetadata:
        # 1. ファイル読み込み
        source = read_file(filepath)

        # 2. AST解析
        tree = ast.parse(source)

        # 3. HTTPメソッド関数を抽出
        for node in tree.body:
            if isinstance(node, FunctionDeclaration):
                if node.name in ["GET", "POST", "PUT", "DELETE"]:
                    method = node.name.lower()
                    endpoint = self.extract_endpoint(node)

        # 4. 型情報を抽出
        request_type = self.extract_request_type(node)
        response_type = self.extract_response_type(node)

        return APIMetadata(
            path=filepath,
            methods=methods,
            request_type=request_type,
            response_type=response_type
        )
```

**抽出すべき情報**:
- HTTPメソッド (GET, POST, PUT, DELETE, PATCH)
- URLパス (ファイルパスから推測)
- リクエストボディの型
- レスポンスの型
- クエリパラメータ
- 認証要件
- JSDocコメント

### コンポーネントパーサー (component_parser.py)

**役割**: React/Next.js コンポーネントからドキュメントを生成

```python
class ComponentParser:
    def parse(self, filepath: str) -> ComponentMetadata:
        # 1. コンポーネント名を抽出
        component_name = self.extract_component_name(filepath)

        # 2. Props型を抽出
        props_interface = self.extract_props_interface(source)

        # 3. Propsの詳細を解析
        props = []
        for prop in props_interface.properties:
            props.append(Prop(
                name=prop.name,
                type=prop.type_annotation,
                required=prop.required,
                default=prop.default_value,
                description=extract_jsdoc(prop)
            ))

        # 4. 使用例を抽出
        examples = self.extract_examples(source)

        return ComponentMetadata(
            name=component_name,
            filepath=filepath,
            props=props,
            examples=examples
        )
```

**抽出すべき情報**:
- コンポーネント名
- Propsの型定義
- 各Propの型、必須かどうか、デフォルト値
- JSDocからの説明
- 使用例（コメントやテストから）

### アーキテクチャビルダー (architecture_builder.py)

**役割**: プロジェクト構造を可視化

```python
class ArchitectureBuilder:
    def build_file_tree(self, root: str) -> str:
        """ファイルツリーをASCII Artで生成"""
        lines = []
        for path in walk_directory(root):
            depth = path.count(os.sep) - root.count(os.sep)
            indent = "  " * depth
            lines.append(f"{indent}{os.path.basename(path)}")
        return "\n".join(lines)

    def build_dependency_graph(self, files: List[str]) -> str:
        """依存関係グラフをMermaid形式で生成"""
        mermaid = ["graph TD"]
        for file in files:
            imports = extract_imports(file)
            for imp in imports:
                mermaid.append(f"  {file} --> {imp}")
        return "\n".join(mermaid)
```

---

## テンプレート構造

### APIドキュメントテンプレート (api.md.j2)

```jinja2
# API ドキュメント

## エンドポイント一覧

{% for endpoint in endpoints %}
### {{ endpoint.method | upper }} {{ endpoint.path }}

**説明**: {{ endpoint.description }}

{% if endpoint.params %}
#### クエリパラメータ

| 名前 | 型 | 必須 | 説明 |
|------|---|----|----|
{% for param in endpoint.params %}
| `{{ param.name }}` | {{ param.type }} | {% if param.required %}✅{% else %}❌{% endif %} | {{ param.description }} |
{% endfor %}
{% endif %}

{% if endpoint.request_body %}
#### リクエストボディ

```typescript
{{ endpoint.request_body | to_ts }}
```
{% endif %}

#### レスポンス

```typescript
{{ endpoint.response | to_ts }}
```

#### 使用例

```bash
curl -X {{ endpoint.method | upper }} {{ endpoint.url }}
```

{% endfor %}
```

### コンポーネントドキュメントテンプレート (component.md.j2)

```jinja2
# {{ component.name }}

{{ component.description }}

## Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|---|----|----------|----|
{% for prop in component.props %}
| `{{ prop.name }}` | `{{ prop.type }}` | {% if prop.required %}✅{% else %}❌{% endif %} | `{{ prop.default }}` | {{ prop.description }} |
{% endfor %}

## 使用例

{% for example in component.examples %}
### {{ example.title }}

```tsx
{{ example.code }}
```

{% endfor %}
```

---

## 設定ファイル (.docsrc.json)

```json
{
  "$schema": "./.opencode/schemas/docs-config.schema.json",
  "outputDir": "docs",
  "include": [
    "src/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}"
  ],
  "exclude": [
    "**/*.test.{ts,tsx}",
    "**/*.spec.{ts,tsx}",
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**"
  ],
  "generators": {
    "api": {
      "enabled": true,
      "paths": ["app/api/**/route.ts", "src/api/**/*.ts"],
      "format": ["markdown", "openapi"],
      "output": "docs/api",
      "openApiVersion": "3.0.0"
    },
    "components": {
      "enabled": true,
      "paths": ["components/**/*.{tsx,jsx}", "src/components/**/*.{tsx,jsx}"],
      "format": ["markdown", "storybook"],
      "output": "docs/components",
      "generateScreenshots": true
    },
    "architecture": {
      "enabled": true,
      "format": ["mermaid", "ascii"],
      "output": "docs/architecture",
      "maxDepth": 5
    }
  },
  "templates": {
    "customDir": ".docsrc/templates",
    "variables": {
      "projectName": "My Project",
      "version": "1.0.0"
    }
  }
}
```

---

## 增量更新戦略

### 変更検出

```python
def detect_changes(config):
    # Git diffから変更ファイルを取得
    changed_files = git_diff_files()

    # 設定のinclude/excludeでフィルタリング
    relevant_files = filter_files(changed_files, config)

    return relevant_files

def incremental_update(files):
    for file in files:
        # 変更ファイルのみを再解析
        metadata = parse_file(file)

        # 関連するドキュメントを再生成
        related_docs = find_related_docs(file)
        for doc in related_docs:
            regenerate_doc(doc, metadata)
```

---

## 統合ポイント

### documentation-writer エージェントとの連携

```python
# ドキュメント生成後に品質チェックを実行
def post_generation_validation(docs_dir):
    # documentation-writerスキルのチェックを実行
    quality_check = run_quality_check(docs_dir)

    if quality_check.errors:
        print(f"⚠️  {len(quality_check.errors)} issues found")
        for error in quality_check.errors:
            print(f"  - {error}")
    else:
        print("✅ Documentation quality check passed")
```

### test-engineer エージェントとの連携

```python
# ドキュメント内のコード例をテスト
def validate_code_examples(docs):
    for doc in docs:
        examples = extract_code_blocks(doc)
        for example in examples:
            if not is_valid_code(example):
                print(f"❌ Invalid code example in {doc.path}")
```

---

## 出力例

### APIドキュメント出力例

```markdown
# API ドキュメント

## エンドポイント一覧

### GET /api/users

ユーザー一覧を取得する

#### クエリパラメータ

| 名前 | 型 | 必須 | 説明 |
|------|---|----|----|
| `page` | number | ❌ | ページ番号（デフォルト: 1） |
| `limit` | number | ❌ | 1ページあたりの件数（デフォルト: 10） |

#### レスポンス

```typescript
interface User {
  id: string
  name: string
  email: string
}

interface UsersResponse {
  users: User[]
  total: number
  page: number
}
```

#### 使用例

```bash
curl https://api.example.com/users?page=1&limit=10
```
```

---

## ベストプラクティス

| 実践 | 説明 |
|------|------|
| **型優先** | TypeScript型から可能な限り情報を抽出 |
| **コメント活用** | JSDocから説明、使用例を取得 |
| **標準準拠** | OpenAPIなど業界標準に従う |
| **可読性** | 人間が読みやすいMarkdownを出力 |
| **機械可読** | JSON/YAMLも併せて出力 |
| **速度** | 增量更新で高速化 |

---

## トラブルシューティング

| 問題 | 原因 | 解決策 |
|------|------|--------|
| 型が抽出されない | 型定義が複雑 | シンプルな型に分解 |
| 循環依存エラー | インポートループ | 依存関係を解消 |
| 生成が遅い | ファイル数が多い | include/excludeで絞り込み |
| テンプレートエラー | 変数が未定義 | デフォルト値を設定 |

---

**更新日**: 2025-02-05
**バージョン**: 1.0
