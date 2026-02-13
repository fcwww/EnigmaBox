# AGENTS.md

本仓库的 Codex/AI 协作约定（给自动化编码代理看的“项目说明书”）。

## 项目概述

- 项目名：EnigmaBox
- 目标：为 Puzzle Hunt 场景提供轻量级密码编解码工具箱（Windows 优先）
- 技术栈：Electron + Vue 3 + Vite + TypeScript + Tailwind CSS
- UI：深色 + 毛玻璃 + 明显交互反馈；全中文界面

## 目录结构（核心）

- `src/main/`：Electron 主进程
- `src/preload/`：预加载脚本（通过 `contextBridge` 暴露最小 API）
- `src/renderer/`：Vue 渲染进程（UI）
- `src/modules/`：密码模块（每种密码一个文件夹）
  - 每个模块导出一个 `CipherProvider`
  - 统一接口见 `src/modules/types.ts`
  - 模块注册表见 `src/modules/index.ts`

## 设计约束

- 插件式扩展：新增功能应以新增 `src/modules/<name>/` 模块的方式接入
- 默认不使用网络请求；规则/映射以本地实现为主
- Windows 体验优先（默认隐藏 Electron 原生菜单栏）
- 安全：渲染进程不启用 `nodeIntegration`，保持 `contextIsolation: true`

## UI/交互原则

- 状态必须“强可见”：选中态尽量使用“白/黑反色”或明确对比（不仅是轻微发光）
- 交互控件要有按压反馈（`active:scale-95` 或等效）

## 文档

- 用户向：`README.md`
- 开发向：`DEVELOPMENT.md`

