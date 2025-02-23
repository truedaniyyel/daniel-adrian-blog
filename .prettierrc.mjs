/** @type {import("prettier").Config} */
export default {
  arrowParens: 'avoid',
  semi: true,
  tabWidth: 2,
  printWidth: 80,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-astro', 'prettier-plugin-svelte'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],
};
