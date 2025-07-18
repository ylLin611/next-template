import type { NextConfig } from 'next';
const { codeInspectorPlugin } = require('code-inspector-plugin');

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }));
    return config;
  },
};

export default nextConfig;
