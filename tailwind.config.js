/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"accent-1": "#ffb4a2",
				"accent-2": "#5dd9c1",
			},
		},
	},
	plugins: [],
};
