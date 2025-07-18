import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.extends('plugin:prettier/recommended', 'eslint-config-prettier'),
  ...compat.plugins('prettier'),
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off', //允许require
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

export default eslintConfig;
