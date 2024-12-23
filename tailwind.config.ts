import type { Config } from "tailwindcss";

const config: Config = {
  // Merging the content arrays and removing duplicates
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  // Enabling dark mode
  darkMode: "class", // Assuming you want to enable dark mode based on the class strategy
  theme: {
    // Merging container configuration from the second file
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {},
  },
  // Merging plugins, adding any unique plugins from both files
  plugins: [],
};

export default config;
