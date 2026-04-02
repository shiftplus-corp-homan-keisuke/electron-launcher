#!/usr/bin/env python3
"""
Documentation Generator - 自動ドキュメント生成ツール

Usage:
    python3 docs_generator.py generate
    python3 docs_generator.py update
    python3 docs_generator.py serve
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any
import glob
import subprocess


class DocsGenerator:
    """ドキュメント生成のメインクラス"""

    def __init__(self, config_path: str = ".docsrc.json"):
        self.config_path = Path(config_path)
        self.config = self._load_config()
        self.root_dir = Path.cwd()

    def _load_config(self) -> Dict[str, Any]:
        """設定ファイルを読み込む"""
        if not self.config_path.exists():
            print(f"❌ Configuration file not found: {self.config_path}")
            print("💡 Run: /docs config init")
            sys.exit(1)

        with open(self.config_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def generate(self, doc_type: str = None):
        """ドキュメントを生成する"""
        print("🚀 Starting documentation generation...")

        generators = self.config.get("generators", {})

        if doc_type:
            # 特定のタイプのみ生成
            if doc_type not in generators:
                print(f"❌ Unknown generator type: {doc_type}")
                sys.exit(1)
            self._generate_type(doc_type, generators[doc_type])
        else:
            # 全ての有効なジェネレーターを実行
            for gen_type, gen_config in generators.items():
                if gen_config.get("enabled", False):
                    self._generate_type(gen_type, gen_config)

        print("✅ Documentation generation completed!")

    def update(self, files: List[str] = None):
        """変更分のみを更新する"""
        print("🔄 Checking for changes...")

        # Git diffから変更ファイルを取得
        if files is None:
            result = subprocess.run(
                ["git", "diff", "--name-only", "HEAD~1"], capture_output=True, text=True
            )
            if result.returncode != 0:
                print("⚠️  Not a git repository or no commits")
                print("💡 Try: python3 docs_generator.py generate")
                sys.exit(1)
            files = result.stdout.strip().split("\n")
            files = [f for f in files if f]

        # 設定に基づいてフィルタリング
        relevant_files = self._filter_files(files)

        if not relevant_files:
            print("ℹ️  No relevant files changed")
            return

        print(f"📝 Found {len(relevant_files)} changed files")

        for file in relevant_files:
            print(f"  - {file}")

        # 変更ファイルに基づいて再生成
        # TODO: 各パーサーのincremental_updateを実装
        print("💡 Incremental update not yet implemented, running full generation...")
        self.generate()

    def serve(self, port: int = 8000):
        """ドキュメントプレビューサーバーを起動する"""
        docs_dir = Path(self.config.get("outputDir", "docs"))

        if not docs_dir.exists():
            print(f"❌ Documentation directory not found: {docs_dir}")
            print("💡 Run: /docs generate")
            sys.exit(1)

        print(f"🌐 Starting documentation server...")
        print(f"📁 Serving: {docs_dir}")
        print(f"🔗 URL: http://localhost:{port}")
        print("\nPress Ctrl+C to stop\n")

        try:
            import http.server
            import socketserver

            class DocsHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
                def __init__(self, *args, **kwargs):
                    super().__init__(*args, directory=str(docs_dir), **kwargs)

                def log_message(self, format, *args):
                    # ログを抑制
                    pass

            with socketserver.TCPServer(("", port), DocsHTTPRequestHandler) as httpd:
                httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped")
        except Exception as e:
            print(f"❌ Error starting server: {e}")
            sys.exit(1)

    def config_init(self):
        """設定ファイルを初期化する"""
        if self.config_path.exists():
            response = input(
                f"⚠️  {self.config_path} already exists. Overwrite? (y/N): "
            )
            if response.lower() != "y":
                print("❌ Aborted")
                sys.exit(0)

        # プロジェクトタイプを検出
        project_type = self._detect_project_type()

        # デフォルト設定を生成
        config = self._get_default_config(project_type)

        # 設定ファイルを保存
        with open(self.config_path, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2, ensure_ascii=False)

        print(f"✅ Configuration file created: {self.config_path}")
        print(f"📝 Project type detected: {project_type}")
        print("\n💡 Edit the configuration to customize documentation generation")
        print("💡 Run: /docs generate")

    def _generate_type(self, doc_type: str, config: Dict[str, Any]):
        """特定のタイプのドキュメントを生成する"""
        print(f"\n📄 Generating {doc_type} documentation...")

        if doc_type == "api":
            self._generate_api_docs(config)
        elif doc_type == "components":
            self._generate_component_docs(config)
        elif doc_type == "architecture":
            self._generate_architecture_docs(config)
        else:
            print(f"⚠️  Unknown generator type: {doc_type}")

    def _generate_api_docs(self, config: Dict[str, Any]):
        """APIドキュメントを生成する"""
        from api_parser import APIParser

        paths = config.get("paths", ["app/api/**/route.ts"])
        output_dir = Path(config.get("output", "docs/api"))
        formats = config.get("format", ["markdown", "openapi"])

        output_dir.mkdir(parents=True, exist_ok=True)

        # ファイルを収集
        files = []
        for pattern in paths:
            files.extend(glob.glob(pattern, recursive=True))

        print(f"  Found {len(files)} API route files")

        # パーサーを実行
        parser = APIParser(self.root_dir)
        endpoints = []

        for file in files:
            result = parser.parse(file)
            if result:
                endpoints.extend(result)

        print(f"  Parsed {len(endpoints)} endpoints")

        # 各フォーマットで出力
        for fmt in formats:
            if fmt == "markdown":
                self._write_api_markdown(endpoints, output_dir)
            elif fmt == "openapi":
                self._write_openapi(
                    endpoints, output_dir, config.get("openApiVersion", "3.0.0")
                )

        print(f"  ✅ Generated {formats} in {output_dir}")

    def _generate_component_docs(self, config: Dict[str, Any]):
        """コンポーネントドキュメントを生成する"""
        from component_parser import ComponentParser

        paths = config.get("paths", ["components/**/*.{tsx,jsx}"])
        output_dir = Path(config.get("output", "docs/components"))
        formats = config.get("format", ["markdown", "storybook"])

        output_dir.mkdir(parents=True, exist_ok=True)

        # ファイルを収集
        files = []
        for pattern in paths:
            files.extend(glob.glob(pattern, recursive=True))

        print(f"  Found {len(files)} component files")

        # パーサーを実行
        parser = ComponentParser(self.root_dir)
        components = []

        for file in files:
            result = parser.parse(file)
            if result:
                components.append(result)

        print(f"  Parsed {len(components)} components")

        # 各フォーマットで出力
        for fmt in formats:
            if fmt == "markdown":
                self._write_component_markdown(components, output_dir)
            elif fmt == "storybook":
                self._write_storybook_stories(components, output_dir)

        print(f"  ✅ Generated {formats} in {output_dir}")

    def _generate_architecture_docs(self, config: Dict[str, Any]):
        """アーキテクチャドキュメントを生成する"""
        from architecture_builder import ArchitectureBuilder

        output_dir = Path(config.get("output", "docs/architecture"))
        formats = config.get("format", ["mermaid", "ascii"])
        max_depth = config.get("maxDepth", 5)

        output_dir.mkdir(parents=True, exist_ok=True)

        builder = ArchitectureBuilder(self.root_dir, max_depth)

        # ファイルツリー
        if "ascii" in formats:
            tree = builder.build_file_tree()
            tree_file = output_dir / "file-tree.md"
            tree_file.write_text(f"# File Tree\n\n```\n{tree}\n```\n", encoding="utf-8")
            print(f"  ✅ Generated file tree")

        # 依存関係グラフ
        if "mermaid" in formats:
            graph = builder.build_dependency_graph()
            graph_file = output_dir / "dependencies.md"
            graph_file.write_text(
                f"# Dependencies\n\n```mermaid\n{graph}\n```\n", encoding="utf-8"
            )
            print(f"  ✅ Generated dependency graph")

        print(f"  ✅ Generated {formats} in {output_dir}")

    def _write_api_markdown(self, endpoints: List[Dict], output_dir: Path):
        """APIドキュメントをMarkdown形式で出力"""
        # テンプレートを使用して出力
        # TODO: Jinja2テンプレートを実装
        output = "# API Documentation\n\n"

        for endpoint in endpoints:
            output += f"## {endpoint['method'].upper()} {endpoint['path']}\n\n"
            if endpoint.get("description"):
                output += f"{endpoint['description']}\n\n"

            if endpoint.get("params"):
                output += "### Parameters\n\n"
                output += "| Name | Type | Required | Description |\n"
                output += "|------|------|----------|------------|\n"
                for param in endpoint["params"]:
                    output += f"| `{param['name']}` | {param['type']} | {'Yes' if param.get('required') else 'No'} | {param.get('description', '')} |\n"
                output += "\n"

        (output_dir / "endpoints.md").write_text(output, encoding="utf-8")

    def _write_openapi(self, endpoints: List[Dict], output_dir: Path, version: str):
        """OpenAPI形式で出力"""
        openapi = {
            "openapi": version,
            "info": {
                "title": self.config.get("templates", {})
                .get("variables", {})
                .get("projectName", "API"),
                "version": self.config.get("templates", {})
                .get("variables", {})
                .get("version", "1.0.0"),
            },
            "paths": {},
        }

        for endpoint in endpoints:
            path = endpoint["path"]
            method = endpoint["method"].lower()

            if path not in openapi["paths"]:
                openapi["paths"][path] = {}

            openapi["paths"][path][method] = {
                "summary": endpoint.get("description", ""),
                "responses": endpoint.get("responses", {}),
            }

        (output_dir / "openapi.json").write_text(
            json.dumps(openapi, indent=2), encoding="utf-8"
        )

    def _write_component_markdown(self, components: List[Dict], output_dir: Path):
        """コンポーネントドキュメントをMarkdown形式で出力"""
        # TODO: 実装
        pass

    def _write_storybook_stories(self, components: List[Dict], output_dir: Path):
        """Storybookストーリーを生成"""
        # TODO: 実装
        pass

    def _filter_files(self, files: List[str]) -> List[str]:
        """設定に基づいてファイルをフィルタリング"""
        include_patterns = self.config.get("include", ["**/*.{ts,tsx}"])
        exclude_patterns = self.config.get("exclude", ["**/*.test.{ts,tsx}"])

        filtered = []

        for file in files:
            # Includeチェック
            if not any(
                glob.fnmatch.fnmatch(file, pattern) for pattern in include_patterns
            ):
                continue

            # Excludeチェック
            if any(glob.fnmatch.fnmatch(file, pattern) for pattern in exclude_patterns):
                continue

            filtered.append(file)

        return filtered

    def _detect_project_type(self) -> str:
        """プロジェクトタイプを検出する"""
        if Path("package.json").exists():
            with open("package.json", "r") as f:
                pkg = json.load(f)
                deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}

                if "next" in deps:
                    return "nextjs"
                elif "react" in deps:
                    return "react"
                elif "vue" in deps:
                    return "vue"

        if Path("requirements.txt").exists() or Path("pyproject.toml").exists():
            return "python"

        return "generic"

    def _get_default_config(self, project_type: str) -> Dict[str, Any]:
        """プロジェクトタイプに応じたデフォルト設定を取得する"""
        # デフォルト設定を返す
        return {
            "outputDir": "docs",
            "include": ["**/*.{ts,tsx,js,jsx}"],
            "exclude": ["**/*.test.{ts,tsx,js,jsx}", "**/node_modules/**"],
            "generators": {
                "api": {
                    "enabled": project_type in ["nextjs", "react"],
                    "paths": ["app/api/**/route.ts", "pages/api/**/*.ts"],
                    "format": ["markdown", "openapi"],
                    "output": "docs/api",
                    "openApiVersion": "3.0.0",
                },
                "components": {
                    "enabled": project_type in ["nextjs", "react", "vue"],
                    "paths": ["components/**/*.{tsx,jsx,vue}"],
                    "format": ["markdown"],
                    "output": "docs/components",
                    "generateScreenshots": False,
                },
                "architecture": {
                    "enabled": True,
                    "format": ["mermaid", "ascii"],
                    "output": "docs/architecture",
                    "maxDepth": 5,
                },
            },
            "templates": {
                "customDir": ".docsrc/templates",
                "variables": {"projectName": "My Project", "version": "1.0.0"},
            },
        }


def main():
    parser = argparse.ArgumentParser(description="Documentation Generator")
    parser.add_argument(
        "command",
        choices=["generate", "update", "serve", "config"],
        help="Command to run",
    )
    parser.add_argument(
        "--type", help="Document type to generate (api, components, architecture)"
    )
    parser.add_argument("--files", help="Files to update (comma-separated)")
    parser.add_argument(
        "--config", default=".docsrc.json", help="Configuration file path"
    )
    parser.add_argument(
        "--port", type=int, default=8000, help="Server port for serve command"
    )

    args = parser.parse_args()

    generator = DocsGenerator(args.config)

    if args.command == "generate":
        generator.generate(args.type)
    elif args.command == "update":
        files = args.files.split(",") if args.files else None
        generator.update(files)
    elif args.command == "serve":
        generator.serve(args.port)
    elif args.command == "config":
        generator.config_init()


if __name__ == "__main__":
    main()
