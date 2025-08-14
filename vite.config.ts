import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import ui from '@nuxt/ui/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    ui({
      ui: {
        colors: {
          primary: 'blue',
          neutral: 'neutral'
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'HxMeetCoreComponent',
      fileName: (format) => `hxmeet-core-component.${format}.js`,
    },
    rollupOptions: {
      // Externe Abhängigkeiten nicht mitbündeln
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
