# 初始化项目

```bash
npx create-next-app@latest
```

# 配置 Prettier

```bash
pnpm i eslint-plugin-prettier prettier eslint-config-prettier -D
```

## 修改 eslint.config.mjs

```js
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.extends('plugin:prettier/recommended', 'eslint-config-prettier'),
  ...compat.plugins('prettier'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': ['off'], //允许使用any
      '@typescript-eslint/ban-ts-comment': 'off', //允许使用@ts-ignore
      '@typescript-eslint/no-non-null-assertion': 'off', //允许使用非空断言
      '@typescript-eslint/no-var-requires': 'off', //允许使用CommonJS的写法
      'no-console': [
        //提交时不允许有console.log
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  },
];
```

## 新建 .prettierrc

```js
{
  "endOfLine": "auto",
  "printWidth": 120,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "bracketSpacing": true
}
```

## 新建 .prettierignore

```bash
/.next/
/node_modules
.env*.local
```

## 新增 npm scripts

```bash
"lint": "eslint src --fix --ext .ts,.tsx,.js,.jsx --max-warnings 0",
```

## 配置 VSCode

`/.vscode/setting.json`

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "yzhang.markdown-all-in-one",
    "PulkitGangwar.nextjs-snippets",
    "styled-components.vscode-styled-components",
    "bradlc.vscode-tailwindcss"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  }
}
```

Prettier插件配置Print Width => 120

## Prettier Plugins

```bash
pnpm i -D prettier-plugin-organize-imports prettier-plugin-tailwindcss
```

修改 `.prettierrc`

```json
...
"plugins": [
  "prettier-plugin-organize-imports",
  "prettier-plugin-tailwindcss"
]
```

# 配置 Git hooks

```bash
pnpm i -D husky lint-staged @commitlint/cli @commitlint/config-conventional czg cz-git
```

- run

```bash
# 生成 .husky 的文件夹
pnpm exec husky init

# 修改 pre-commit
pnpm lint:lint-staged

# 添加 commitlint
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

## commitlint.config.cjs

```js
/** @type {import('cz-git').UserConfig} */
module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
  },
  prompt: {
    messages: {
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围[可选]:',
      customScope: '请输入自定义的提交范围 :',
      subject: '请简要描述提交 :\n',
      body: '填写更加详细的变更描述[可选]。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更[可选]。使用 "|" 换行 :\n',
      footerPrefixsSelect: '选择关联issue前缀[可选]:',
      customFooterPrefixs: '输入自定义issue前缀 :',
      footer: '列举关联issue [可选] 例如: #31, #I3244 :\n',
      confirmCommit: '是否提交或修改commit ?',
    },
    types: [
      { value: 'feat', name: 'feat:   ✨  新增功能', emoji: '✨' },
      { value: 'fix', name: 'fix:   🐛  修复缺陷', emoji: '🐛' },
      { value: 'docs', name: 'docs:   📝  文档变更', emoji: '📝' },
      {
        value: 'style',
        name: 'style:   💄  代码格式',
        emoji: '💄',
      },
      {
        value: 'refactor',
        name: 'refactor:   🔨  代码重构',
        emoji: '🔨',
      },
      { value: 'perf', name: 'perf:    ⚡️  性能优化', emoji: '⚡️' },
      {
        value: 'test',
        name: 'test:   ✅  测试',
        emoji: '✅',
      },
      {
        value: 'build',
        name: 'build:   📦️  打包构建',
        emoji: '📦️',
      },
      { value: 'ci', name: 'ci:   👷  CI 配置变更', emoji: '👷' },
      { value: 'revert', name: 'revert:   ⏪️  代码回退', emoji: '⏪️' },
      {
        value: 'chore',
        name: 'chore:   🚀  构建/工程依赖/工具',
        emoji: '🚀',
      },
      { value: 'wip', name: 'wip:   🚧  正在开发中', emoji: '🚧' },
      { value: 'workflow', name: 'workflow:   🎯  工作流程改进', emoji: '🎯' },
    ],
    useEmoji: true,
    scopes: [],
    customScopesAlign: 'bottom',
    emptyScopesAlias: 'empty',
    customScopesAlias: 'custom',
    allowBreakingChanges: ['feat', 'fix'],
    skipQuestions: ['scope', 'body', 'breaking', 'footerPrefix', 'footer'], // 自定义选择指定的问题不显示
  },
};
```

## package.json

- 配置 lint-staged
- 添加commit命令

```json
...
"scripts": {
  "commit": "git add . && czg",
  "czg": "czg",
  "lint:lint-staged": "lint-staged"
}
...
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "pnpm lint",
    "prettier --write"
  ]
}
...
```

# 工具类

## Alt+Shift+鼠标选中dom 打开Vscode

```bash
pnpm i code-inspector-plugin -D
```

next.config.ts

```js
webpack: (config, { dev, isServer }) => {
  config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }));
  return config;
},
```

## shadcn UI
```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button
```