import type { Config } from 'tailwindcss'
const config: Config = {
  darkMode: 'class',
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { 500: '#0ea5e9', 600: '#0284c7' } },
      boxShadow: { 'soft': '0 10px 30px rgba(2,132,199,.15)' }
    }
  },
  plugins: []
}
export default config
