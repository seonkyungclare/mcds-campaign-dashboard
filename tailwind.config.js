/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // MCDS Semantic Colors
        'semantic': {
          'fg-default': '#1a1a1a',
          'fg-disabled': '#b3b3b3',
          'fill-light': '#ffffff',
          'fill-disabled': '#f2f2f2',
          'fill-accent': '#2b52f0',
          'fill-accent-hovered': '#1a40d9',
          'fill-accent-pressed': '#1e34b3',
          'fill-accent-disabled': '#bacbff',
        }
      },
      spacing: {
        '0.75': '3px',
      },
      fontFamily: {
        'sans': ['Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '32px'],
        '2xl': ['24px', '36px'],
      }
    },
  },
  plugins: [],
}
