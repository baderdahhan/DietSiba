import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F4ED',
        green: {
          DEFAULT: '#4A5D3A',
          light: '#5C6E45',
          dark: '#3D4E30',
        },
        gold: {
          DEFAULT: '#C2A14D',
          dark: '#B89548',
        },
        foreground: '#2D2D2D',
        muted: '#6B6B6B',
        border: '#E5E0D5',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'var(--font-heading-ar)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
};
export default config;
