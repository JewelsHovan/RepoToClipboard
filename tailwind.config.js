/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Blue
        background: '#FFFFFF',  // White
        text: '#1F2937',       // Dark Gray
        success: '#10B981',    // Green
        error: '#EF4444',      // Red
      },
    },
  },
  plugins: [],
}

