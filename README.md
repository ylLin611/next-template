# 初始化项目

```bash
npx create-next-app@latest
```

# 配置 Prettier

```bash
npm i eslint-plugin-prettier prettier eslint-config-prettier -D
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
npm i -D prettier-plugin-organize-imports prettier-plugin-tailwindcss
```

修改 `.prettierrc`

```json
...
"plugins": [
  "prettier-plugin-organize-imports",
  "prettier-plugin-tailwindcss"
]
```
