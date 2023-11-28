/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#f4f1ff",
					100: "#ebe6ff",
					200: "#dad0ff",
					300: "#bfaaff",
					400: "#a17aff",
					500: "#8445ff",
					600: "#781fff",
					700: "#6a0ef3",
					800: "#520abd",
					900: "#4a0ba7",
					950: "#2b0372",
				},
				"accent-1": "#588157",
				"accent-2": "#e76f51",
			},
		},
	},
	plugins: [],
};
