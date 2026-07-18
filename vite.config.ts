/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: [
      // App.test historically imported ./data/questions while App uses the reviewed bank.
      { find: /^\.\/data\/questions$/, replacement: fileURLToPath(new URL('./src/data/effectiveQuestions.ts', import.meta.url)) },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
