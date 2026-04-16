import ast
import base64
import subprocess
import sys
import textwrap
from types import CodeType

from app.config import settings


FORBIDDEN_NAMES = {
    "__import__",
    "eval",
    "exec",
    "open",
    "compile",
    "globals",
    "locals",
    "input",
    "help",
    "dir",
    "getattr",
    "setattr",
    "delattr",
}

FORBIDDEN_MODULES = {
    "os",
    "sys",
    "subprocess",
    "socket",
    "pathlib",
    "shutil",
    "signal",
    "threading",
    "multiprocessing",
    "ctypes",
    "resource",
    "importlib",
    "builtins",
}

SAFE_BUILTINS = {
    "print": print,
    "len": len,
    "range": range,
    "str": str,
    "int": int,
    "float": float,
    "bool": bool,
    "list": list,
    "dict": dict,
    "tuple": tuple,
    "set": set,
    "enumerate": enumerate,
    "sum": sum,
    "min": min,
    "max": max,
    "abs": abs,
    "sorted": sorted,
    "zip": zip,
    "any": any,
    "all": all,
}

SAFE_BUILTIN_NAMES = tuple(SAFE_BUILTINS.keys())


class SandboxError(Exception):
    pass


def _validate_ast(code: str) -> CodeType:
    tree = ast.parse(code, mode="exec")
    try_star_node = getattr(ast, "TryStar", None)
    for node in ast.walk(tree):
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            names = [alias.name.split(".")[0] for alias in node.names]
            if any(name in FORBIDDEN_MODULES for name in names):
                raise SandboxError("检测到危险模块导入。")
            raise SandboxError("MVP 沙盒暂不允许 import 语句。")
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in FORBIDDEN_NAMES:
            raise SandboxError(f"检测到禁用调用: {node.func.id}")
        if isinstance(node, ast.Attribute) and node.attr.startswith("__"):
            raise SandboxError("检测到危险属性访问。")
        skip_nodes = tuple(
            item
            for item in (ast.With, ast.AsyncWith, try_star_node, ast.Lambda, ast.ClassDef, ast.AsyncFunctionDef)
            if item is not None
        )
        if isinstance(node, skip_nodes):
            continue
    return compile(tree, "<pyrunner>", "exec")


def execute_user_code(code: str) -> tuple[str, str | None]:
    _validate_ast(code)
    payload = base64.b64encode(code.encode("utf-8")).decode("ascii")
    runner = textwrap.dedent(
        f"""
        import base64
        import builtins
        import contextlib
        import io

        SAFE_BUILTIN_NAMES = {repr(SAFE_BUILTIN_NAMES)}
        SAFE_BUILTINS = {{name: getattr(builtins, name) for name in SAFE_BUILTIN_NAMES}}
        code = base64.b64decode("{payload}").decode("utf-8")
        stdout = io.StringIO()
        runtime_globals = {{"__builtins__": SAFE_BUILTINS.copy()}}

        try:
            with contextlib.redirect_stdout(stdout):
                exec(code, runtime_globals, {{}})
            print(stdout.getvalue()[:{settings.sandbox_output_limit}], end="")
        except Exception as exc:
            print(stdout.getvalue()[:{settings.sandbox_output_limit}], end="")
            raise SystemExit(str(exc))
        """
    )
    try:
        result = subprocess.run(
            [sys.executable, "-I", "-c", runner],
            capture_output=True,
            text=True,
            timeout=settings.sandbox_timeout_seconds,
        )
    except subprocess.TimeoutExpired:
        return "", "代码执行超时，请检查是否出现死循环。"

    output = result.stdout[: settings.sandbox_output_limit]
    error = result.stderr.strip() or None
    if result.returncode != 0:
        error = error or "代码执行失败。"
    return output, error
