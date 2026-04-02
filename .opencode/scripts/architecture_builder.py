"""
Architecture Builder - プロジェクト構造を可視化するビルダー
"""

import os
from pathlib import Path
from typing import Dict, List, Any
from collections import defaultdict


class ArchitectureBuilder:
    """アーキテクチャ図を生成するビルダー"""

    def __init__(self, root_dir: Path, max_depth: int = 5):
        self.root_dir = root_dir
        self.max_depth = max_depth

    def build_file_tree(self) -> str:
        """ファイルツリーをASCII Art形式で生成する"""
        lines = []
        self._build_tree_recursive(self.root_dir, lines, "", 0)
        return "\n".join(lines)

    def _build_tree_recursive(
        self, current_dir: Path, lines: List[str], prefix: str, depth: int
    ):
        """再帰的にファイルツリーを構築する"""
        if depth > self.max_depth:
            return

        try:
            entries = sorted(
                current_dir.iterdir(), key=lambda x: (not x.is_dir(), x.name)
            )
        except PermissionError:
            return

        # 除外するディレクトリ
        exclude_dirs = {".git", "node_modules", ".next", "dist", "build", "__pycache__"}
        # 除外するファイル
        exclude_files = {".gitignore", ".DS_Store", "Thumbs.db"}

        entries = [
            e
            for e in entries
            if e.name not in exclude_dirs and e.name not in exclude_files
        ]

        for i, entry in enumerate(entries):
            is_last = i == len(entries) - 1

            # プレフィックスを決定
            connector = "└── " if is_last else "├── "
            lines.append(f"{prefix}{connector}{entry.name}")

            # サブディレクトリを再帰
            if entry.is_dir() and not entry.is_symlink():
                extension = "    " if is_last else "│   "
                self._build_tree_recursive(entry, lines, prefix + extension, depth + 1)

    def build_dependency_graph(self) -> str:
        """依存関係グラフをMermaid形式で生成する"""
        # TypeScript/JavaScriptのimport文を解析
        graph_lines = []
        graph_lines.append("graph TD")

        dependencies = self._collect_imports()

        # ノードとエッジを追加
        for source, targets in dependencies.items():
            for target in targets:
                # パスを簡略化
                source_short = self._shorten_path(source)
                target_short = self._shorten_path(target)
                graph_lines.append(f"  {source_short} --> {target_short}")

        return "\n".join(graph_lines)

    def _collect_imports(self) -> Dict[str, List[str]]:
        """プロジェクト内のimport文を収集する"""
        dependencies = defaultdict(list)

        # 除外するディレクトリ
        exclude_dirs = {".git", "node_modules", ".next", "dist", "build", "__pycache__"}

        # ソースファイルを探索
        for file_path in self.root_dir.rglob("*"):
            # ディレクトリと除外パスをスキップ
            if not file_path.is_file():
                continue
            if any(exclude in file_path.parts for exclude in exclude_dirs):
                continue
            if file_path.suffix in [".ts", ".tsx", ".js", ".jsx"]:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                # import文を抽出
                import_pattern = r"import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['\"]([^'\"]+)['\"]"
                matches = re.findall(import_pattern, content)

                for match in matches:
                    # 外部モジュール（node_modulesなど）を除外
                    if not match.startswith(".") and not match.startswith("/"):
                        continue

                    # 相対パスを絶対パスに変換
                    import_path = (file_path.parent / match).resolve()

                    # プロジェクト内のファイルのみ対象
                    if self._is_inside_project(import_path):
                        dependencies[str(file_path)].append(str(import_path))

        return dependencies

    def _shorten_path(self, filepath: str) -> str:
        """パスを簡略化して表示する"""
        try:
            rel_path = Path(filepath).relative_to(self.root_dir)
            return str(rel_path).replace("/", "_").replace("\\", "_").replace(".", "_")
        except ValueError:
            return Path(filepath).stem

    def _is_inside_project(self, filepath: Path) -> bool:
        """ファイルがプロジェクト内にあるかチェックする"""
        try:
            filepath.relative_to(self.root_dir)
            return True
        except ValueError:
            return False

    def get_statistics(self) -> Dict[str, Any]:
        """プロジェクトの統計情報を収集する"""
        stats = {
            "total_files": 0,
            "ts_files": 0,
            "tsx_files": 0,
            "js_files": 0,
            "jsx_files": 0,
            "components": 0,
            "api_routes": 0,
            "directories": defaultdict(dict),
        }

        for file_path in self.root_dir.rglob("*"):
            if file_path.is_file():
                stats["total_files"] += 1

                suffix = file_path.suffix
                if suffix == ".ts":
                    stats["ts_files"] += 1
                elif suffix == ".tsx":
                    stats["tsx_files"] += 1
                    # コンポーネントかチェック
                    if self._is_component(file_path):
                        stats["components"] += 1
                elif suffix == ".js":
                    stats["js_files"] += 1
                elif suffix == ".jsx":
                    stats["jsx_files"] += 1

                # APIルートかチェック
                if self._is_api_route(file_path):
                    stats["api_routes"] += 1

            elif file_path.is_dir():
                parent_dir = str(file_path.parent.relative_to(self.root_dir))
                stats["directories"][parent_dir]["file_count"] = (
                    stats["directories"][parent_dir].get("file_count", 0) + 1
                )

        return stats

    def _is_component(self, filepath: Path) -> bool:
        """ファイルがReactコンポーネントかチェックする"""
        # components/ ディレクトリ内
        if "components" in filepath.parts:
            return True

        # ファイル名が大文字で始まる
        if filepath.stem and filepath.stem[0].isupper():
            return True

        return False

    def _is_api_route(self, filepath: Path) -> bool:
        """ファイルがAPIルートかチェックする"""
        # app/api/*/route.ts
        # pages/api/**/*.ts
        parts = filepath.parts
        if "api" in parts and (
            filepath.name == "route.ts" or filepath.name == "route.js"
        ):
            return True

        return False


import re
