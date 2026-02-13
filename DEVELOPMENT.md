# 开发指南（Windows）

> 本项目默认假设开发环境和生产环境都是 Windows。

## 1. 环境准备

- Node.js（建议 LTS）
- Git

## 2. 安装依赖

在项目根目录执行：

```bash
npm install
```

## 3. 本地开发（热更新）

```bash
npm run dev
```

该命令会同时启动：

- Vite dev server（渲染进程）
- `tsc --watch`（编译 Electron 主进程/预加载脚本到 `dist-electron/`）
- Electron（等待 dev server 与 `dist-electron/main/index.js` 就绪后启动）

## 4. 类型检查

```bash
npm run typecheck
```

## 5. 打包（Windows 安装包）

```bash
npm run dist
```

输出目录默认在 `release/`（由 `package.json -> build.directories.output` 配置）。

## 5.1 应用图标（可选）

把截图/原图放到 `assets/icon-source.png` 后执行：

```bash
npm run make:icon
```

会生成：

- `assets/icon.png`（透明背景 PNG）
- `build/icon.ico`（Windows 打包用 ICO）

## 6. 项目结构

- `src/main/`：Electron 主进程
- `src/preload/`：预加载脚本（`contextBridge` 暴露最小信息给渲染进程）
- `src/renderer/`：Vue 渲染进程（UI）
- `src/modules/`：各类密码模块（每种密码独立文件夹）

## 7. 如何新增一个密码模块（插件式）

1. 在 `src/modules/` 下新建文件夹，例如：`src/modules/vigenere/`
2. 在该目录实现一个 Vue 组件（工具页面），例如：`VigenereTool.vue`
3. 在该目录新增 `index.ts` 导出一个 `CipherProvider`
4. 在 `src/modules/index.ts` 中将 provider 加入 `cipherProviders`

`CipherProvider` 接口定义在：

- `src/modules/types.ts`

## 8. 约定与注意事项

- UI 统一中文展示；输出内容通常为英文字母/数字（Puzzle Hunt 常见）
- 映射/规则可能存在题目变体：如果你给我一题的截图或规则，我可以把对应模块改成“可配置/多变体”模式
