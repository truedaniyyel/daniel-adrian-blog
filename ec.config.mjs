import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineEcConfig({
  plugins: [pluginLineNumbers()],
  themes: ['andromeeda'],

  styleOverrides: {
    borderRadius: '0.5rem',
    uiFontFamily: 'JetBrains Mono',
    codeFontFamily: 'JetBrains Mono',
    codeFontSize: '1rem',
    frames: {
      shadowColor: 'none',
      editorBackground: '#07090f',
      editorTabBarBackground: '#07090f',
      editorActiveTabBackground: '#07090f',
    },
  },
});