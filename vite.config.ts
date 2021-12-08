import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [react(), dts({
    exclude: ['demo'],
    outputDir: 'dist',
    insertTypesEntry: true,
  })],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@demo': resolve(__dirname, './demo'),
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'scraph',
      fileName: (format) => `scraph.${format}.js`,
    },
  },
  css: {
    modules: {
      generateScopedName: '[local]',
    }
  }
})
