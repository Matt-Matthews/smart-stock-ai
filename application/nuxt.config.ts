// https://nuxt.com/docs/api/configuration/nuxt-config
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui',],
  css: [join(currentDir, './app/assets/css/main.css')],
  ui: {
    prefix: 'Nuxt'
  },
})