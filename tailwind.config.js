/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
			colors: {
				primary: "#273043",
				danger: "#FB2343",
				accent: "#6CD4FF",
				background: "#171C27",
				twitter: "#1DA1F2",
				github: "#6e5494",
				gmail: "#DB4437",
				kofi: "#13C3FF",
			}
		},
  },
  plugins: [],
	darkMode: 'class',
}