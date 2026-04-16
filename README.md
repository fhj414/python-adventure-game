# PyRunner

PyRunner 是一个移动端优先的 Python 闯关学习项目，适合零基础入门，也适合拿来做碎片化复习。项目围绕 Python 基础知识设计关卡，并提供提示、讲解、相似题和错题复盘能力。

当前仓库已经包含一套可以直接运行和部署的版本：

- Next.js + TypeScript + Tailwind CSS 前端
- FastAPI + SQLite 后端
- 前后端分离
- 30 个首批关卡
- 受限 Python 沙盒执行
- 兼容 OpenAI 协议的模型接入封装，默认按月之暗面配置
- 错题本、关卡地图、个人中心、AI 教练
- 一键初始化脚本和测试数据
- Render / Railway 部署配置文件

## 项目结构

```text
PyRunner/
├─ backend/                # FastAPI API + SQLite + Python sandbox
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ models.py
│  │  ├─ schemas.py
│  │  ├─ database.py
│  │  ├─ config.py
│  │  ├─ services/
│  │  │  ├─ sandbox.py
│  │  │  ├─ ai_service.py
│  │  │  └─ level_seed.py
│  │  └─ scripts/init_db.py
│  ├─ requirements.txt
│  ├─ nixpacks.toml
│  ├─ Procfile
│  ├─ .env.example
│  └─ start.sh
├─ frontend/               # Next.js H5 UI
│  ├─ app/
│  ├─ components/
│  ├─ lib/
│  ├─ package.json
│  ├─ .nvmrc
│  ├─ .env.example
│  └─ start.sh
├─ init.sh                 # 一键初始化
├─ render.yaml             # Render 一键部署配置
└─ README.md
```

## 功能说明

### 1. 首页

- Logo / 品牌头图
- 开始闯关
- 每日挑战
- 错题本
- AI 教练
- 继续学习

### 2. 关卡地图页

- 七大世界：
  - 新手村
  - 判断森林
  - 循环矿洞
  - 函数神殿
  - 容器仓库
  - Bug 修理厂
  - AI 实验室
- 展示解锁状态、分数、星级

### 3. 闯关页

- 关卡标题和知识点
- 题目描述
- 代码编辑区
- 运行按钮 / 重置按钮 / 提示按钮 / AI 讲解按钮
- 输出区
- 测试用例状态
- 通关动画和得分展示

### 4. AI 教练页

- 输入题目或代码
- 支持四种操作：
  - 给我一点提示
  - 像老师一样讲懂
  - 只指出错误位置
  - 给我两道类似题

### 5. 错题本页

- 展示历史错误题
- 按知识点筛选
- 重新练习
- AI 复盘入口

### 6. 个人中心页

- 积分
- 等级
- 连续学习天数
- 掌握知识点数量
- 徽章

## Python 知识覆盖

首批关卡覆盖：

- print
- 变量
- 字符串
- 数字计算
- if / else / elif
- for / while
- function / return
- list / dict / tuple / set
- 异常基础
- 简单文本处理

## 数据库设计

SQLite 表：

- `users`
  - `id`
  - `nickname`
  - `total_points`
  - `level`
  - `streak_days`
  - `mastered_concepts`
  - `current_level_id`
- `levels`
  - `id`
  - `world`
  - `world_order`
  - `level_order`
  - `title`
  - `description`
  - `concept_tags`
  - `starter_code`
  - `answer_code`
  - `test_cases`
  - `hints`
  - `difficulty`
  - `knowledge_point`
  - `xp_reward`
  - `coin_reward`
- `user_progress`
  - `user_id`
  - `level_id`
  - `stars`
  - `score`
  - `attempts`
  - `completed`
  - `last_code`
  - `last_result`
- `wrong_questions`
  - `user_id`
  - `level_id`
  - `knowledge_point`
  - `user_code`
  - `error_message`
  - `resolved`
- `badges`
  - `code`
  - `name`
  - `description`
  - `icon`
  - `unlock_rule`

初始化脚本位于 `backend/app/scripts/init_db.py`，会自动创建表、写入 30 个关卡、徽章和测试用户数据。

## 模型接口

后端统一封装在 `backend/app/services/ai_service.py`，使用 OpenAI 兼容协议，默认配置为月之暗面接口。

支持方法：

- `explain_level(levelId, userCode, error)` 对应 `/api/ai/explain`
- `give_hint(levelId, userCode)` 对应 `/api/ai/hint`
- `generate_similar_questions(levelId)` 对应 `/api/ai/similar`
- `review_wrong_question(recordId)` 对应 `/api/ai/review`

统一返回结构：

```json
{
  "action": "hint",
  "source": "mock",
  "data": {
    "title": "关卡标题",
    "message": "返回内容",
    "tips": ["提示 1", "提示 2"]
  }
}
```

优先读取：

- `MOONSHOT_API_KEY`
- 如果未设置，再回退到 `OPENAI_API_KEY`

默认配置：

- `OPENAI_BASE_URL=https://api.moonshot.cn/v1`
- `OPENAI_MODEL=moonshot-v1-8k`

如果没有配置密钥，系统会自动降级为本地 mock 响应，页面和接口仍然可以完整演示。

## Python 沙盒限制

MVP 沙盒位于 `backend/app/services/sandbox.py`，主要限制：

- 禁止 `import os`、`subprocess`、`socket` 等危险模块
- MVP 直接禁用所有 `import`
- 禁止 `eval`、`exec`、`open`、`__import__` 等危险调用
- 限制可用 builtins
- 限制执行超时
- 限制输出长度
- 通过 AST 做基础静态检查

说明：这是当前版本使用的轻量安全方案，适合先上线验证。后续如果要承接更高并发或开放自由输入，建议换成独立容器沙盒或 Firecracker / gVisor 一类的隔离方案。

## 本地启动

### 方式一：一键初始化

在项目根目录执行：

```bash
chmod +x init.sh backend/start.sh frontend/start.sh
./init.sh
```

### 方式二：手动启动

#### 启动后端

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 -m app.scripts.init_db
./start.sh
```

后端默认运行在：

- `http://localhost:8000`

#### 启动前端

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

前端默认运行在：

- `http://localhost:3000`

## 环境变量

### backend/.env

```env
APP_NAME=PyRunner API
APP_ENV=development
API_PREFIX=/api
DATABASE_URL=sqlite:///./pyrunner.db
CORS_ORIGINS=http://localhost:3000
MOONSHOT_API_KEY=
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
SANDBOX_TIMEOUT_SECONDS=2
SANDBOX_OUTPUT_LIMIT=1200
```

### frontend/.env.local

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## API 概览

- `GET /health`
- `GET /api/bootstrap`
- `GET /api/levels`
- `GET /api/levels/{level_id}`
- `POST /api/run`
- `GET /api/wrong-questions`
- `GET /api/profile`
- `POST /api/ai/hint`
- `POST /api/ai/explain`
- `POST /api/ai/locate-error`
- `POST /api/ai/similar`
- `POST /api/ai/review`

## 部署方案

### 前端部署到 Vercel

1. 将仓库推到 GitHub。
2. 在 Vercel 导入项目。
3. Root Directory 选择 `frontend`。
4. Node 版本使用 `20.x`，仓库已提供 `frontend/.nvmrc` 和 `package.json` engines。
5. Build Command 使用默认 `next build`。
6. 配置环境变量：
   - `NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com` 或 Railway 域名
7. 部署完成后得到 H5 站点地址。

### 后端部署到 Render

1. 在 Render 连接 GitHub 仓库。
2. 可直接使用仓库根目录的 `render.yaml` 自动创建服务。
3. 如果手动配置，Root Directory 选择 `backend`。
4. Build Command：

```bash
pip install -r requirements.txt && python3 -m app.scripts.init_db
```

5. Start Command：

```bash
python3 -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

6. 环境变量按 `.env.example` 配置。
7. 首次启动会自动生成 SQLite 文件。

注意：Render 免费实例的磁盘不是长期持久化的。如果要长期保留用户进度，建议挂持久磁盘，或者把数据库迁移到 Postgres。

### 后端部署到 Railway

1. 在 Railway 新建项目并连接仓库。
2. Root Directory 选择 `backend`。
3. 仓库已提供 `backend/nixpacks.toml` 与 `backend/Procfile`，可直接识别启动配置。
4. 如果手动配置 Start Command：

```bash
python3 -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

5. 在 Deploy 或 Pre-deploy 阶段执行：

```bash
pip install -r requirements.txt
python3 -m app.scripts.init_db
```

6. 配置环境变量后发布。

同样建议为数据库挂持久卷，避免 SQLite 文件丢失。

## 推荐部署顺序

1. 先部署后端到 Render 或 Railway
2. 拿到后端域名后配置前端 `NEXT_PUBLIC_API_BASE_URL`
3. 前端部署到 Vercel
4. 用手机浏览器实际走一遍首页、地图、闯关、AI 教练和错题本

## 后续可以继续补的内容

- 真实登录与多用户
- 题目输入参数化判题
- 更强的代码编辑器
- 每日挑战独立题池
- 徽章解锁逻辑自动化
- 生产级代码沙盒隔离
- SQLite 升级为 Postgres

## 备注

- 当前仓库是完整项目骨架，不是零散 demo 片段。
- 未配置月之暗面或其他兼容接口密钥时，也能完整跑通演示。
- 已提供测试数据，便于今天直接上线验证。
