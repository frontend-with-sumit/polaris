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
				"accent-3": "#ff595e",
			},
		},
		animation: {
			vibrate: "shake 0.82s cubic-bezier(.36,.07,.19,.97) 1s both infinite",
		},
		keyframes: {
			shake: {
				"10%, 90%": {
					transform: "translate3d(-1px, 0, 0)",
				},
				"20%, 80%": {
					transform: "translate3d(1px, 0, 0)",
				},
				"30%, 50%, 70%": {
					transform: "translate3d(-1px, 0, 0)",
				},
				"40%, 60%": {
					transform: "translate3d(1px, 0, 0)",
				},
			},
		},
	},
	plugins: [],
};
