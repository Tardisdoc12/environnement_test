// vitest.config.ts

import { defineConfig } from "vite"

export default defineConfig({
  test: {
    global: true,
    environment: "jsdom",
    reporters: ['html'],
  }
})