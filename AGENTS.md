# Repository Guidelines

## 项目定位
这是一个基于 Next.js App Router 的前端模板项目，当前核心技术栈：

- Next.js 16 + React 19 + TypeScript（`strict: true`）
- Tailwind CSS 4（优先用于样式开发）
- `next-intl`（多语言）
- `next-themes`（主题切换）
- TanStack Query（客户端数据请求与缓存）
- Husky + lint-staged + commitlint + czg（提交规范）

## 目录与分层约定
- `src/app`：App Router 路由、布局、全局样式与 API Route（如 `api/health`）。
- `src/components`：可复用组件；`src/components/ui` 存放基础 UI 组件。
- `src/features/<domain>/api`：按领域组织请求函数（仅处理请求和类型）。
- `src/features/<domain>/query`：按领域组织 `useQuery` / `useMutation` hooks 与 query keys。
- `src/lib/http`：统一请求封装与错误处理。
- `src/lib/query`：Query Client 及查询架构约定。
- `src/providers`：全局 Provider（Query、Theme 等）。
- `messages`：`next-intl` 文案 JSON。
- `public`：静态资源。

统一使用 `@/*` 路径别名（见 `tsconfig.json`）。

## 开发命令
- `pnpm.cmd dev`：启动本地开发服务。
- `pnpm.cmd build`：构建生产版本。
- `pnpm.cmd start`：运行生产服务。
- `pnpm.cmd lint`：对 `src` 执行 ESLint（自动修复，且不允许 warning）。
- `pnpm.cmd prettier`：格式化 `src/**/*.{ts,tsx,js,jsx}`。
- `pnpm.cmd lint:lint-staged`：手动执行暂存区检查。
- `pnpm.cmd commit` / `pnpm.cmd czg`：通过交互式流程生成提交信息。

## 代码风格
- TypeScript 默认严格模式，避免无意义 `any` 扩散。
- Prettier：2 空格、单引号、分号、尾随逗号、`printWidth: 120`。
- ESLint 基于 Next Core Web Vitals + TypeScript + Prettier。
- 组件文件使用 PascalCase；hooks 使用 `use-*.ts` 或 `use-*.tsx` 语义命名。
- 新增请求逻辑时，优先复用 `src/lib/http/request.ts` 与既有 query 架构。

## 测试与验证
当前仓库未引入独立测试框架，默认通过 lint + 手动验证保证质量。

提交前至少执行：
- `pnpm.cmd lint`
- `pnpm.cmd dev` 并验证受影响页面、交互、主题切换与多语言行为（如有改动）

若引入复杂业务逻辑，建议补充测试（推荐同目录 `*.test.ts(x)`）。

## 提交与 PR 规范
- `pre-commit` 执行 `lint-staged`。
- `commit-msg` 校验 Conventional Commits。
- 允许类型：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`、`wip`、`workflow`、`types`、`release`。

PR 建议包含：
- 变更说明与影响范围
- 关联任务 / Issue
- UI 变更截图（如有）
- i18n / 主题 / 请求层改动说明（如有）
