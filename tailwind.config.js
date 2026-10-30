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
        nasa: {
          blue: '#0B3D91',
          dark: '#061B4A',
          red: '#D83933',
          light: '#161619',
          border: 'rgba(255, 255, 255, 0.1)',
          text: '#FFFFFF',
          muted: '#9CA3AF',
          subtle: '#6B7280',
        },
        space: {
          deep: '#000000',
          surface: '#0B0F17',
          card: '#111113',
          light: '#161619',
          elevated: '#1a1a1e',
          hover: '#222226',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.1)',
          active: '#0B3D91',
        },
        lunar: {
          blue: '#0B3D91',
          sky: '#38BDF8',
          cyan: '#0284C7',
          parchment: '#0B0F17',
        },
        solar: {
          amber: '#B45309',
          gold: '#D97706',
        },
        regolith: {
          DEFAULT: '#565C65',
          light: '#71767A',
          dark: '#1B1B1B',
        },
        status: {
          nominal: '#0B6A45',
          anomaly: '#8C5103',
          loss: '#9C1A1A',
          active: '#0B3D91',
          planned: '#0B3D91',
          testing: '#5B21B6',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Space Grotesk', 'Inter', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', '-apple-system', 'sans-serif'],
        serif: ['Space Grotesk', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
