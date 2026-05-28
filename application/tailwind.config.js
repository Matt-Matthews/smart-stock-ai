/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts,tsx}", // Added .tsx for potential React components
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        ui: {
          background: 'var(--ui-bg)',
          primary: 'var(--ui-primary)',
          secondary: 'var(--ui-secondary)',
        },
      },
    },
  },
  plugins: [],
}