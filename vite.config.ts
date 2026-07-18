/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const reviewedQuestions = fileURLToPath(new URL('./src/data/effectiveQuestions.ts', import.meta.url))

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: [
      // Legacy tests imported the raw bank directly; runtime and validation use the reviewed bank.
      { find: /^\.\/data\/questions$/, replacement: reviewedQuestions },
      { find: /^\.\.\/data\/questions$/, replacement: reviewedQuestions },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
