import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const { codeInspectorPlugin } = require('code-inspector-plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }));
    return config;
  },
};

export default withNextIntl(nextConfig);
