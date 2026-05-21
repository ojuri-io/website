/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Stone — the single warm-grey scale. Hierarchy comes from
        // weight, size, and spacing — not color contrast.
        stone: {
          50:  '#FDFCFA',
          100: '#FAF6F0',
          200: '#F0EBE2',
          300: '#D9D2C6',
          400: '#B0A89B',
          500: '#857E72',
          600: '#5C564C',
          700: '#3F3A33',
          800: '#2A2620',
          900: '#1A1612',
        },
        // Chart accents — dashboard only. Never on brand surfaces.
        chart: {
          allow:   '#5C7A5C',
          decline: '#A35140',
          review:  '#7A6F4A',
        },
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Source Serif Pro', 'Georgia', 'serif'],
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.02em',
        label:    '0.05em',
      },
      maxWidth: {
        container: '1180px',
        measure:   '68ch',
      },
      spacing: {
        // Aliases for the brand's 4px-base spacing scale.
        // Tailwind already covers most of these via its default ramp;
        // only the values our design uses get named aliases here.
      },
      borderRadius: {
        none: '0',
        sm:   '2px',
        md:   '4px',
        lg:   '8px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
