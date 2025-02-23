<script lang="ts">
  import uiIcons from '@assets/uiIcons';
  import { modalStore } from '@components/Modal/modalStore.svelte';

  function KeydownSlash(e: KeyboardEvent) {
    if (modalStore.isOpen('search') || e.code !== 'Slash') return;
    e.preventDefault();
    modalStore.open('search');
  }
</script>

<svelte:window onkeydown={KeydownSlash} />

<button
  class="btn search-button"
  onclick={() => modalStore.open('search')}
  aria-label="Open search bar"
  aria-expanded={modalStore.isOpen('search')}
>
  <span class="search-icon">{@html uiIcons.search}</span>
  <span class="search-text">Search...</span>
  <kbd aria-label="Slash">{@html uiIcons.slash}</kbd>
</button>

<style>
  .search-button {
    gap: var(--px-12);
    width: 100%;
    padding: var(--px-8) var(--px-8) var(--px-8) var(--px-16);
    border-radius: var(--radius-on-surface);
    background-color: var(--on-surface-light);
  }

  :global(.dark) .search-button {
    background-color: var(--on-surface-dark);
  }

  .search-icon {
    width: var(--px-16);
    height: var(--px-16);
  }

  .search-button kbd {
    margin-left: auto;
    padding: var(--px-2) var(--px-8);
    border-radius: var(--radius-search-kbd);
    color: var(--text-dark);
    background-color: var(--surface-dark);
  }

  :global(.dark) .search-button kbd {
    background-color: var(--surface-light);
    color: var(--text-light);
  }

  @media (max-width: 34.25rem) {
    .search-button {
      width: auto;
      height: 100%;
      padding: var(--px-6);
      margin-left: auto;
      background-color: transparent;
    }

    :global(.dark) .search-button {
      background-color: transparent;
    }

    .search-button kbd,
    .search-text {
      display: none;
    }
  }
</style>
