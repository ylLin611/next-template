import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  prettierRecommended,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  },
];

export default eslintConfig;
