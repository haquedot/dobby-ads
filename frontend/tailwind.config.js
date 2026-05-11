/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121212",
        mist: "#f4f4f0",
        sand: "#d9cdbf",
        coral: "#ff6b4a",
        ocean: "#2a9d8f",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.08)",
      },
      fontFamily: {
        display: ["\"Space Grotesk\"", "system-ui", "sans-serif"],
        body: ["\"Manrope\"", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
