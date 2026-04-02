"""
API Parser - Next.js APIルートからドキュメントを生成するパーサー
"""

import re
import ast
from pathlib import Path
from typing import Dict, List, Any, Optional


class APIParser:
    """Next.js APIルートを解析するパーサー"""

    def __init__(self, root_dir: Path):
        self.root_dir = root_dir

    def parse(self, filepath: str) -> List[Dict[str, Any]]:
        """APIルートファイルを解析してエンドポイント情報を抽出する"""
        file_path = self.root_dir / filepath

        if not file_path.exists():
            return []

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # ファイルパスからURLパスを生成
        url_path = self._extract_url_path(filepath)

        endpoints = []

        # HTTPメソッド関数を検出 (GET, POST, PUT, DELETE, PATCH)
        http_methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]

        for method in http_methods:
            # 関数宣言を検出: export async function GET(...)
            pattern = rf"export\s+(async\s+)?function\s+{method}\s*\("
            if re.search(pattern, content):
                endpoint = self._parse_endpoint(content, method, url_path, filepath)
                if endpoint:
                    endpoints.append(endpoint)

        return endpoints

    def _extract_url_path(self, filepath: str) -> str:
        """ファイルパスからURLパスを抽出する"""
        # app/api/users/route.ts -> /api/users
        # app/api/posts/[id]/route.ts -> /api/posts/:id

        # app/ または pages/ を除去
        path = filepath.replace("app/", "").replace("pages/", "")

        # route.ts または route.js を除去
        path = re.sub(r"/route\.(ts|js|tsx|jsx)$", "", path)

        # [param] を :param に変換
        path = re.sub(r"\[(\w+)\]", r":\1", path)

        # 先頭に / を追加
        return "/" + path if not path.startswith("/") else path

    def _parse_endpoint(
        self, content: str, method: str, url_path: str, filepath: str
    ) -> Optional[Dict[str, Any]]:
        """エンドポイントの詳細を解析する"""
        endpoint = {
            "method": method,
            "path": url_path,
            "filepath": filepath,
            "description": self._extract_description(content, method),
            "params": self._extract_params(content, method),
            "request_body": self._extract_request_body(content, method),
            "response": self._extract_response(content, method),
            "example": self._generate_example(method, url_path),
            "errors": self._extract_errors(content, method),
        }

        return endpoint

    def _extract_description(self, content: str, method: str) -> str:
        """JSDocから説明を抽出する"""
        # 関数の前のJSDocコメントを検出
        pattern = rf"/\*\*[\s\S]*?\*/\s*export\s+(?:async\s+)?function\s+{method}"
        match = re.search(pattern, content)

        if match:
            jsdoc = match.group(0)
            # @タグを除去して説明文を抽出
            lines = []
            for line in jsdoc.split("\n"):
                line = line.strip().rstrip("*/")
                if line.startswith("*"):
                    line = line[1:].strip()
                if line and not line.startswith("@"):
                    lines.append(line)
            return "\n".join(lines).strip()

        return f"{method.upper()} endpoint for {self._extract_url_path('')}"

    def _extract_params(self, content: str, method: str) -> List[Dict[str, Any]]:
        """クエリパラメータを抽出する"""
        params = []

        # URLSearchParamsの使用を検出
        pattern = r'req\.nextUrl\.searchParams\.get\([\'"](\w+)[\'"]\)'
        matches = re.findall(pattern, content)

        for param_name in matches:
            params.append(
                {
                    "name": param_name,
                    "type": "string",
                    "required": False,
                    "description": f"Query parameter: {param_name}",
                }
            )

        # 関数の引数からパスパラメータを抽出
        # TODO: TypeScriptの型解析を実装

        return params

    def _extract_request_body(self, content: str, method: str) -> Optional[str]:
        """リクエストボディの型を抽出する"""
        if method not in ["POST", "PUT", "PATCH"]:
            return None

        # req.json() の使用を検出
        if "await req.json()" in content:
            # TODO: TypeScriptの型を解析
            return "interface RequestBody {\n  // Add properties based on your implementation\n}"

        return None

    def _extract_response(self, content: str, method: str) -> Optional[str]:
        """レスポンスの型を抽出する"""
        # Response.json() の呼び出しを検出
        pattern = r"Response\.json\(([^)]+)\)"
        matches = re.findall(pattern, content)

        if matches:
            # TODO: 実際のオブジェクト構造を解析
            return "interface Response {\n  // Add properties based on your implementation\n}"

        return "interface Response {\n  success: boolean\n}"

    def _generate_example(self, method: str, url_path: str) -> str:
        """使用例（curlコマンド）を生成する"""
        base_url = "http://localhost:3000"
        return f"curl -X {method.upper()} '{base_url}{url_path}'"

    def _extract_errors(self, content: str, method: str) -> List[Dict[str, Any]]:
        """エラー応答を抽出する"""
        errors = []

        # return Response.json(..., { status: ... }) を検出
        pattern = r"Response\.json\([^,]+,\s*\{\s*status:\s*(\d+)\s*\}"
        matches = re.findall(pattern, content)

        for status_code in matches:
            error_desc = {
                "401": "Unauthorized",
                "403": "Forbidden",
                "404": "Not Found",
                "500": "Internal Server Error",
            }.get(status_code, f"Error {status_code}")

            errors.append({"code": int(status_code), "description": error_desc})

        return errors
