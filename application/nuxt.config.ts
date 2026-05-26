// https://nuxt.com/docs/api/configuration/nuxt-config
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-apollo'],
  css: [join(currentDir, './app/assets/css/main.css')],
  ui: {
    prefix: 'Nuxt'
  },
  // @ts-ignore
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:5000/api/v1/graphql'
      }
    }
  }
})
