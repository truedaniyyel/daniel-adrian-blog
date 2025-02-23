import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import astroParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";
import svelteParser from "svelte-eslint-parser";
import eslintPluginSvelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginSvelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      "astro/no-conflict-set-directives": "error",
      "astro/no-unused-css-selector": "warn",
    },
  },
  {
    files: ["*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".svelte"],
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  {
    ignores: ["dist/**", ".astro", ".svelte", "node_modules"],
  },
  prettier,
];
