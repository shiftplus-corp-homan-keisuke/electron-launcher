"""
Component Parser - React/Next.js コンポーネントからドキュメントを生成するパーサー
"""

import re
from pathlib import Path
from typing import Dict, List, Any, Optional


class ComponentParser:
    """React/Next.js コンポーネントを解析するパーサー"""

    def __init__(self, root_dir: Path):
        self.root_dir = root_dir

    def parse(self, filepath: str) -> Optional[Dict[str, Any]]:
        """コンポーネントファイルを解析してメタデータを抽出する"""
        file_path = self.root_dir / filepath

        if not file_path.exists():
            return None

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # コンポーネント名を抽出
        component_name = self._extract_component_name(filepath, content)

        if not component_name:
            return None

        component = {
            "name": component_name,
            "filepath": filepath,
            "description": self._extract_description(content, component_name),
            "props": self._extract_props(content, component_name),
            "examples": self._extract_examples(content, component_name),
            "notes": self._extract_notes(content),
        }

        return component

    def _extract_component_name(self, filepath: str, content: str) -> Optional[str]:
        """コンポーネント名を抽出する"""
        # ファイル名から推測
        filename = Path(filepath).stem
        # Button.tsx -> Button
        # button.tsx -> button
        # useButton.ts -> useButton (hook)

        # export function/export const を検出
        pattern = r"export\s+(?:function|const)\s+(\w+)"
        matches = re.findall(pattern, content)

        # 大文字で始まる名前を探す（コンポーネント）
        for match in matches:
            if match[0].isupper():
                return match

        # ファイル名が大文字で始まる場合はそれを返す
        if filename and filename[0].isupper():
            return filename

        # PascalCaseに変換
        return "".join(word.capitalize() for word in filename.split("-"))

    def _extract_description(self, content: str, component_name: str) -> str:
        """JSDocから説明を抽出する"""
        # コンポーネントの前のJSDocを検出
        pattern = (
            rf"/\*\*[\s\S]*?\*/\s*(?:export\s+)?(?:function|const)\s+{component_name}"
        )
        match = re.search(pattern, content)

        if match:
            jsdoc = match.group(0)
            lines = []
            for line in jsdoc.split("\n"):
                line = line.strip().rstrip("*/")
                if line.startswith("*"):
                    line = line[1:].strip()
                if line and not line.startswith("@"):
                    lines.append(line)
            return "\n".join(lines).strip()

        return f"{component_name} component"

    def _extract_props(self, content: str, component_name: str) -> List[Dict[str, Any]]:
        """Propsの型定義を抽出する"""
        props = []

        # TypeScriptのinterfaceを検出
        pattern = rf"(?:export\s+)?interface\s+(\w*Props?\w*)\s*{{([^}}]+)}}"
        matches = re.findall(pattern, content, re.DOTALL)

        for interface_name, interface_body in matches:
            # Props関連のinterfaceかチェック
            if "props" in interface_name.lower():
                props.extend(self._parse_interface_body(interface_body))

        # 型引数を検出: function Component<T extends Props>(props: T)
        pattern = rf"(?:export\s+)?(?:function|const)\s+{component_name}<([^>]+)>"
        match = re.search(pattern, content)

        if match:
            generic_types = match.group(1)
            # TODO: ジェネリック型の解析

        return props

    def _parse_interface_body(self, body: str) -> List[Dict[str, Any]]:
        """interfaceの本文を解析してプロパティ情報を抽出する"""
        props = []

        # 行ごとに分割
        lines = body.strip().split("\n")

        for line in lines:
            line = line.strip().rstrip(";")

            # コメント行をスキップ
            if line.startswith("//") or line.startswith("*"):
                continue

            # プロパティのパターン: name: type
            pattern = r"(\w+)\s*(\?)?:\s*([^{;]+)(?:\s*=\s*([^;]+))?"
            match = re.match(pattern, line)

            if match:
                prop_name = match.group(1)
                is_optional = match.group(2) is not None
                prop_type = match.group(3).strip()
                default_value = match.group(4).strip() if match.group(4) else None

                # JSDocを検索
                description = self._find_jsdoc_for_prop(line)

                props.append(
                    {
                        "name": prop_name,
                        "type": prop_type,
                        "required": not is_optional,
                        "default": default_value,
                        "description": description,
                    }
                )

        return props

    def _find_jsdoc_for_prop(self, line: str) -> str:
        """プロパティに関連するJSDocを探す"""
        # TODO: 実装
        return ""

    def _extract_examples(
        self, content: str, component_name: str
    ) -> List[Dict[str, Any]]:
        """使用例を抽出する"""
        examples = []

        # @example タグを検出
        pattern = r"@example\s+([\s\S]*?)(?=@|\*/)"
        matches = re.findall(pattern, content)

        for i, match in enumerate(matches):
            example_code = match.strip()
            examples.append({"title": f"Example {i + 1}", "code": example_code})

        return examples

    def _extract_notes(self, content: str) -> List[str]:
        """注意点を抽出する"""
        notes = []

        # @note または @remark タグを検出
        pattern = r"@(?:note|remark)\s+([^\n]+)"
        matches = re.findall(pattern, content)

        notes.extend(matches)

        return notes
