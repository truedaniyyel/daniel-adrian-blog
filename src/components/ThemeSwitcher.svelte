<script lang="ts">
  import uiIcons from '@assets/uiIcons';
  import { onMount } from 'svelte';
  import type { ThemeOption } from 'types';

  let currentTheme: ThemeOption = $state('light');

  const themeIcons = {
    light: uiIcons.theme.light,
    dark: uiIcons.theme.dark,
  };

  function applyTheme(theme: ThemeOption) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  function cycleTheme() {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  }

  onMount(() => {
    const savedTheme =
      (localStorage.getItem('theme') as ThemeOption) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    applyTheme(savedTheme);
  });
</script>

<button
  onclick={cycleTheme}
  aria-label={`Current theme: ${currentTheme}. Click to switch theme.`}
  class="nav-link btn theme-switcher-btn"
>
  {@html themeIcons[currentTheme]}
</button>

<style>
  .theme-switcher-btn :global(svg) {
    width: var(--px-24);
    height: var(--px-24);
  }

  @media (max-width: 50rem) {
    :global(.nav-link).theme-switcher-btn {
      padding-block: var(--px-12);
    }
  }
</style>
