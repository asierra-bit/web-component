import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://rbpiwu0vm6.execute-api.us-east-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/documentation/v1')
      }
    }
  },
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'MiComponente',
      fileName: 'mi-componente',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'mi-componente.css'
          return assetInfo.name
        }
      },
      external: []
    },
    cssCodeSplit: false,
    assetsInlineLimit: 0
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
