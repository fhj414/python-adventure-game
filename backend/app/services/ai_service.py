from __future__ import annotations

import json

import httpx

from app.config import settings


def get_ai_api_key() -> str:
    return settings.moonshot_api_key or settings.openai_api_key


def _mock_response(action: str, level_title: str, user_code: str = "", error: str = "") -> dict:
    base = {
        "action": action,
        "source": "fallback",
        "data": {
            "title": level_title,
            "message": "先从题目的输入、输出和关键条件下手，先写出最小可运行版本。",
            "tips": [
                "先看题目要求中的动词，比如输出、定义、返回。",
                "把大题拆成 2 到 3 个小步骤先写出来。",
                "如果报错，优先检查缩进、冒号、括号和变量名。",
            ],
            "userCodePreview": user_code[:200],
            "errorSummary": error[:160],
        },
    }
    if action == "hint":
        base["data"]["message"] = "提示：先完成最小正确版本，再考虑写得更优雅。"
    elif action == "explain":
        base["data"]["message"] = "像老师一样讲：先理解输入和输出，再把中间规则翻译成 Python 语句。"
    elif action == "locate_error":
        base["data"]["message"] = "可能的问题通常在条件判断、缩进或返回值位置。"
    elif action == "similar":
        base["data"]["questions"] = [
            {"title": f"{level_title} 变体 A", "description": "把样例中的数字或字符串替换成新数据，保持同样思路解题。"},
            {"title": f"{level_title} 变体 B", "description": "增加一个 if 判断或一次循环，让你多练一步。"},
        ]
    elif action == "review":
        base["data"]["message"] = "复盘建议：先定位错误，再重写最小可运行版本，最后自己总结一条规则。"
    return base


async def call_ai(action: str, level_title: str, prompt: str, user_code: str = "", error: str = "") -> dict:
    api_key = get_ai_api_key()
    if not api_key:
        return _mock_response(action, level_title, user_code, error)

    headers = {"Authorization": f"Bearer {api_key}"}
    payload = {
        "model": settings.openai_model,
        "messages": [
            {"role": "system", "content": "你是 PyRunner 的 AI 教练，请用中文、简洁、鼓励式风格回复 JSON。"},
            {
                "role": "user",
                "content": (
                    f"动作: {action}\n关卡: {level_title}\n用户代码:\n{user_code}\n错误:\n{error}\n"
                    f"任务:\n{prompt}\n"
                    "请返回 JSON，包含 title, message, tips, questions(可选)。"
                ),
            },
        ],
        "response_format": {"type": "json_object"},
    }
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(f"{settings.openai_base_url}/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        return {"action": action, "source": "compatible-api", "data": json.loads(content)}
