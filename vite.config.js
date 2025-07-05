import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'

export default defineConfig({
  plugins: [
    vue(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    })
  ],
  build: {
  lib: {
    entry: 'src/main.js',
    name: 'MiComponente',
    fileName: 'mi-componente',
    formats: ['iife']
  },
  rollupOptions: {
    output: {
      inlineDynamicImports: true
    }
  }
}
})
