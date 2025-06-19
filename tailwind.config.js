/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify all files that use Nativewind classes for tree-shaking and JIT compilation
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // These colors rely on CSS variables (defined in your global styles or root)
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',

        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',

        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',

        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',

        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',

        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',

        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',

        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        chart1: 'var(--chart-1)',
        chart2: 'var(--chart-2)',
        chart3: 'var(--chart-3)',
        chart4: 'var(--chart-4)',
        chart5: 'var(--chart-5)',

        sidebar: 'var(--sidebar)',
        'sidebar-foreground': 'var(--sidebar-foreground)',
        'sidebar-primary': 'var(--sidebar-primary)',
        'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
        'sidebar-accent': 'var(--sidebar-accent)',
        'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
        'sidebar-border': 'var(--sidebar-border)',
        'sidebar-ring': 'var(--sidebar-ring)',
      },
      fontFamily: {
        // Define font families matching your imported Rubik and Space Mono fonts
        rubik: ['Rubik-Regular', 'sans-serif'],

        'rubik-black': ['Rubik-Black', 'sans-serif'],
        'rubik-black-italic': ['Rubik-BlackItalic', 'sans-serif'],
        'rubik-bold': ['Rubik-Bold', 'sans-serif'],
        'rubik-bold-italic': ['Rubik-BoldItalic', 'sans-serif'],
        'rubik-extra-bold': ['Rubik-ExtraBold', 'sans-serif'],
        'rubik-extra-bold-italic': ['Rubik-ExtraBoldItalic', 'sans-serif'],
        'rubik-italic': ['Rubik-Italic', 'sans-serif'],
        'rubik-light': ['Rubik-Light', 'sans-serif'],
        'rubik-light-italic': ['Rubik-LightItalic', 'sans-serif'],
        'rubik-medium': ['Rubik-Medium', 'sans-serif'],
        'rubik-medium-italic': ['Rubik-MediumItalic', 'sans-serif'],
        'rubik-semi-bold': ['Rubik-SemiBold', 'sans-serif'],
        'rubik-semi-bold-italic': ['Rubik-SemiBoldItalic', 'sans-serif'],

        'space-mono': ['SpaceMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
