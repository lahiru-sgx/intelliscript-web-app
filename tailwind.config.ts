import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-blue': '#1fb6ff',
        'app-green': {
          100: '#effcf6',
          200: '#c6f7e2',
          300: '#8eedc7',
          500: '#57cc99',
          700: '#3a7667',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
