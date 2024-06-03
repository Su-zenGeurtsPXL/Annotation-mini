import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    includeSource: ['tests/**/*.{js,ts}'],
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
});
