import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    // Use jsdom for React component tests
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8', // use V8 coverage provider
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/__tests__/**'],
    },
  },
});
