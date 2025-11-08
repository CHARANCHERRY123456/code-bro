// CommonJS PostCSS config so Next.js/PostCSS reliably pick up Tailwind
module.exports = {
  plugins: {
    // Use the new PostCSS plugin package for Tailwind
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
