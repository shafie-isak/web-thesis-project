/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
           colors: {
            'my-primary': '#7A4DDF',
        'my-secondary': '#3B2A8E',
      },
    },
  },
  plugins: [],
}
