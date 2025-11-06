// CommonJS PostCSS config so Next.js/PostCSS reliably pick up Tailwind
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
