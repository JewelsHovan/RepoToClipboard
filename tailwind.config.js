/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',    // Keeping your original blue
          '90': '#2563EB',       // Darker shade for hover
        },
        background: '#FDFBF7',    // White
        text: '#1F2937',         // Dark Gray
        success: '#10B981',      // Green
        error: '#EF4444',        // Red
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          700: '#616161',
          800: '#424242',
        },
      },
    },
  },
  plugins: [],
}

