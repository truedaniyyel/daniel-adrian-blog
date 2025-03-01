<script lang="ts">
  import uiIcons from '@assets/uiIcons';
  import Modal from '@components/Modal/Modal.svelte';
  import { debounce } from '@utils/debounce';
  import { onMount } from 'svelte';
  import { navigate } from 'astro:transitions/client';

  import type { SearchItem } from '@utils/search/types';

  type SearchState = 'load' | 'ready' | 'error' | 'searching' | 'results';

  const DEBOUNCE_TIME = 200; // ms
  const MIN_SEARCH_LENGTH = 2;

  let searchStatus = $state<SearchState>('load');
  let searchTerm = $state('');
  let searchResults = $state<SearchItem[]>([]);
  let errorMessage = $state<string | null>(null);
  let selectedIndex = $state(-1);
  let searchWorker: Worker;
  let resultsContainer: HTMLUListElement | null = $state(null);

  const debouncedSearch = debounce(term => {
    if (!searchWorker || searchStatus !== 'searching') return;

    searchWorker.postMessage({
      type: 'search',
      payload: { searchTerm: term },
    });
  }, DEBOUNCE_TIME);

  onMount(() => {
    searchWorker = new Worker(
      new URL('../../utils/search/search-worker.ts', import.meta.url),
      { type: 'module' }
    );

    searchWorker.addEventListener('message', e => {
      const { type, payload } = e.data;

      if (type === 'ready') searchStatus = 'ready';
      else if (type === 'results') {
        searchResults = payload.results;
        searchStatus = 'results';
      }
    });

    searchWorker.addEventListener('error', err => {
      console.error('Search worker error:', err);

      searchStatus = 'error';
      errorMessage = 'Search functionality is currently unavailable';
    });

    searchWorker.postMessage({ type: 'load' });

    return () => {
      if (searchWorker) searchWorker.terminate();
      debouncedSearch.cancel();
    };
  });

  $effect(() => {
    if (searchTerm.trim().length >= MIN_SEARCH_LENGTH) {
      searchStatus = 'searching';
      debouncedSearch(searchTerm);
    } else {
      searchStatus = 'ready';
      searchResults = [];
    }
  });

  function navigateSearch(e: KeyboardEvent) {
    if (searchResults.length === 0) return;

    switch (e.code) {
      case 'ArrowDown':
        e.preventDefault();
        if (selectedIndex >= searchResults.length - 1) selectedIndex = 0;
        else selectedIndex++;
        scrollSelectedIntoView();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (selectedIndex < 1) selectedIndex = searchResults.length - 1;
        else selectedIndex--;
        scrollSelectedIntoView();
        break;
      case 'Home':
        e.preventDefault();
        selectedIndex = 0;
        scrollSelectedIntoView();
        break;
      case 'End':
        e.preventDefault();
        selectedIndex = searchResults.length - 1;
        scrollSelectedIntoView();
        break;
      case 'Enter':
        if (selectedIndex >= 0 && searchResults[selectedIndex])
          navigate(searchResults[selectedIndex].path);
        break;
    }
  }

  function scrollSelectedIntoView() {
    if (!resultsContainer) return;

    const selectedItem = resultsContainer.children[
      selectedIndex
    ] as HTMLElement;
    if (selectedItem) {
      selectedItem.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }

  function focus(el: HTMLInputElement) {
    el.focus();
  }
</script>

<Modal type="search">
  {#snippet children()}
    {#if errorMessage}
      <div class="error-message" role="alert">
        {errorMessage}
      </div>
    {:else}
      <input
        type="search"
        class="search-input"
        placeholder="Search..."
        autocomplete="off"
        spellcheck="false"
        aria-label="Search content"
        disabled={searchStatus === 'error'}
        onkeydown={navigateSearch}
        bind:value={searchTerm}
        use:focus
      />

      <div class="search-results-container">
        <div
          class="search-results"
          role="listbox"
          aria-live="polite"
          aria-busy={searchStatus === 'searching'}
        >
          {#if searchStatus === 'load'}
            <p role="status">Initializing search...</p>
          {:else if searchStatus === 'searching'}
            <div class="spinner" role="status" aria-label="Searching..."></div>
          {:else if searchTerm.length < MIN_SEARCH_LENGTH}
            <p role="status">
              Type at least {MIN_SEARCH_LENGTH} characters
            </p>
          {:else if searchStatus === 'results' && searchResults.length > 0}
            <ul bind:this={resultsContainer}>
              {#each searchResults as result, i}
                <li
                  class={[
                    'search-result',
                    { 'active-result': i === selectedIndex },
                  ]}
                >
                  <a
                    class="result-link"
                    id="result-{i}"
                    href={result.path}
                    role="option"
                    aria-selected={i === selectedIndex}
                  >
                    <span class="result-header">{@html result.title}</span>
                    <p class="result-text">{@html result.body}</p>
                  </a>
                </li>
              {/each}
            </ul>
          {:else if searchStatus === 'results' && searchResults.length === 0}
            <p role="status">Nothing found for "{searchTerm}"</p>
          {/if}
        </div>
      </div>
    {/if}
    <footer class="search-nav">
      <ul class="nav-btns">
        <li class="nav-btn">
          <kbd class="nav-btn-icon">enter</kbd>
          <span class="nav-btn-label">to select</span>
        </li>
        <li class="nav-btn">
          <kbd class="nav-btn-icon" aria-label="Arrow down">
            {@html uiIcons.arrow.down}
          </kbd>
          <kbd class="nav-btn-icon" aria-label="Arrow up">
            {@html uiIcons.arrow.up}
          </kbd>
          <span class="nav-btn-label">to navigate</span>
        </li>
        <li class="nav-btn">
          <kbd class="nav-btn-icon">esc</kbd>
          <span class="nav-btn-label">to close</span>
        </li>
      </ul>
    </footer>
  {/snippet}
</Modal>

<style>
  .error-message,
  .search-input,
  .search-results-container,
  .search-nav {
    background-color: var(--surface-light);
    border-radius: var(--radius-surface);
  }

  :global(.dark) .error-message,
  :global(.dark) .search-input,
  :global(.dark) .search-results-container,
  :global(.dark) .search-nav {
    background-color: var(--surface-dark);
  }

  .error-message,
  .search-input {
    margin-bottom: var(--px-8);
    padding: var(--px-12);
  }

  .search-input {
    width: 100%;
  }

  .search-results-container {
    margin-bottom: var(--px-8);
    overflow: hidden;
  }

  .search-results {
    max-height: var(--h-modal);
    padding: var(--px-12);
    overflow-y: auto;
    scroll-padding: var(--px-12);
  }

  .spinner {
    width: var(--px-32);
    height: var(--px-32);
    border: var(--px-4) solid var(--on-surface-light);
    border-top-color: var(--text-light);
    margin: auto;
  }

  :global(.dark) .spinner {
    border-color: var(--on-surface-dark);
    border-top-color: var(--text-dark);
  }

  .search-result {
    padding: var(--px-8) var(--px-12);
    border-radius: var(--radius-on-surface);
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .active-result,
  .nav-btn-icon {
    background-color: var(--on-surface-light);
  }

  :global(.dark) .active-result,
  :global(.dark) .nav-btn-icon {
    background-color: var(--on-surface-dark);
  }

  /* Hover effects - only for devices that support hover */
  @media (hover: hover) and (pointer: fine) {
    .search-result:hover {
      background-color: var(--on-surface-light);
    }

    :global(.dark) .search-result:hover {
      background-color: var(--on-surface-dark);
    }
  }

  .search-result:active {
    background-color: var(--on-surface-dark);
    color: var(--text-dark);
  }

  :global(.dark) .search-result:active {
    background-color: var(--on-surface-light);
    color: var(--text-light);
  }

  .result-header {
    font-size: var(--text-lg);
    font-weight: 650;
  }

  .search-nav {
    padding: var(--px-10);
  }

  .nav-btns {
    display: flex;
    gap: var(--px-24);
  }

  .nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--px-8);
  }

  .nav-btn-icon {
    padding: var(--px-4) var(--px-8);
    border-radius: var(--radius-on-surface);
    font-size: var(--text-xs);
  }

  .nav-btn-icon :global(svg) {
    margin-block: var(--px-2);
  }

  @media (max-width: 34.25rem) {
    .nav-btns {
      gap: var(--px-16);
    }
  }

  @media (max-width: 30.5rem) {
    .search-nav {
      display: none;
    }
  }
</style>
