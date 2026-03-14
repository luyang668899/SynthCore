import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
    include: [
      'src/**/*.test.ts',
      'test/**/*.test.ts',
      'test/**/*.e2e.test.ts'
    ],
    exclude: [
      'node_modules',
      'dist'
    ],
    workers: 16,
    timeout: 60000
  }
});
