// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        slowFloat: "slowFloat 60s linear infinite",
        slowerFloat: "slowerFloat 90s linear infinite",
      },
      keyframes: {
        slowFloat: {
          "0%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(20px, -10px)" },
          "100%": { transform: "translate(0px, 0px)" },
        },
        slowerFloat: {
          "0%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(-15px, 20px)" },
          "100%": { transform: "translate(0px, 0px)" },
        },
      },
    },
  },
  plugins: [],
};
