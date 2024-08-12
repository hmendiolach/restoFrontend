/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'restro-green-light': "#ECF1EB",
        'restro-green': "#70B56A",
        'restro-green-dark': "#243922",
        'restro-border-green-light': "#DCE7DB"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    darkTheme: "light",
  }
}

