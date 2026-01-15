module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /w-\[\d+(\.\d+)?%\]/,
    },
  ],
};
