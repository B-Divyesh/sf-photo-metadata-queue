import { defineConfig } from 'vite';

export default defineConfig({
  build: { target: 'es2022', sourcemap: true },
  test: { include: ['tests/unit/**/*.test.ts'] }
});
