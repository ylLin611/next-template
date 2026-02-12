# Repository Guidelines

## 项目结构与模块组织
本仓库是基于 Next.js App Router 的 TypeScript 模板，集成 Tailwind CSS、`next-intl` 和 `next-themes`。

- `src/app`：路由、布局与全局样式（`globals.css`）。
- `src/components`：可复用组件；`src/components/ui` 存放 shadcn 风格基础组件。
- `src/providers`：全局 Provider（如主题）。
- `src/lib`：通用工具（如 `src/lib/utils.ts`）。
- `src/generated`：代码生成产物（如 Prisma）。
- `messages`：多语言文案 JSON。
- `public`：静态资源。

统一使用 `@/*` 路径别名（见 `tsconfig.json`）。

## 构建、测试与开发命令
本仓库使用 `pnpm`。

- `pnpm dev`：启动本地开发服务。
- `pnpm build`：构建生产版本。
- `pnpm start`：运行生产服务。
- `pnpm lint`：对 `src` 执行 ESLint（自动修复，且不允许 warning）。
- `pnpm prettier`：格式化 `src/**/*.{ts,tsx,js,jsx}`。
- `pnpm lint:lint-staged`：手动执行暂存区检查。
- `pnpm commit` / `pnpm czg`：通过交互式流程生成提交信息。

## 代码风格与命名规范
- TypeScript 开启 `strict`，公共接口尽量声明明确类型。
- Prettier 规则：2 空格缩进、单引号、分号、尾随逗号、`printWidth: 120`。
- ESLint 基于 Next Core Web Vitals + TypeScript + Prettier。
- React 组件文件建议 PascalCase（如 `ThemeToggler.tsx`）。
- 工具模块使用语义化命名，保持简洁一致。

## 测试规范
当前仓库尚未配置专用自动化测试框架，`src` 下暂无测试用例。

提交前至少执行：
- `pnpm lint`
- `pnpm dev` 并手动验证涉及页面与交互

如新增复杂功能，建议同步引入并落地测试（推荐同目录 `*.test.ts(x)`）。

## 提交与 Pull Request 规范
仓库通过 Husky + Commitlint 约束提交流程：
- `pre-commit` 执行 `pnpm lint:lint-staged`
- `commit-msg` 校验 Conventional Commits

允许的提交类型包括：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`、`wip`、`workflow`、`types`、`release`。

PR 建议包含：变更说明、关联任务或 Issue、UI 变更截图（如有）、以及 i18n/主题影响说明（如有）。

