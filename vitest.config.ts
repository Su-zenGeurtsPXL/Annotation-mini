import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.js',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      reporters: 'verbose',
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  })
);
