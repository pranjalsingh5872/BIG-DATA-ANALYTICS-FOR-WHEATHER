/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          950: 'var(--color-canvas-bg, #f1f5f9)',
          900: 'var(--color-nav-bg, #0b1528)',
          850: 'var(--color-divider, #1e293b)',
          800: 'var(--color-surface, #ded6c6)',
          700: 'var(--color-muted-border, #cfc5b2)',
          600: '#9e927c',
          card: 'var(--color-card-bg, #ffffff)',
          border: 'var(--color-card-border, #e2e8f0)'
        },
        cyber: {
          cyan: '#0284c7',
          blue: '#1d4ed8',
          emerald: '#059669',
          crimson: '#dc2626',
          amber: '#d97706'
        }
      }
    },
  },
  plugins: [],
}
