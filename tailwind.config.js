module.exports = {
  content: ["./index.html", "./src/**/*.tsx"],
  theme: {
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
      body: ["Lora", "serif"],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
